import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";

const Dashboard = () => {
  const [motorStatus, setMotorStatus] = useState("Off");
  const [sensorData, setSensorData] = useState({ humidity: 0, temperature: 0, soilMoisture: 0 });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [plantDiseaseStatus, setPlantDiseaseStatus] = useState(null);
  const [motorDurations, setMotorDurations] = useState([]);

  useEffect(() => {
    const userMac = localStorage.getItem("mac");

    const fetchAllData = async () => {
      try {
        const response = await fetch('http://localhost:5001/all-data');
        const data = await response.json();

        if (data.message === "No data found") return;

        const filtered = data.filter(item => item.payload.mac === userMac);

        const formattedData = filtered.map(item => ({
          name: item.payload.timestamp,
          temperature: item.payload.temperature,
          humidity: item.payload.humidity,
          soilMoisture: item.payload.moisture,
          motor: item.payload.motor,
          motorOnTimes: item.payload.motor === 1 ? 1 : 0,
          has_diseased: item.payload.has_diseased
        }));

        setAnalyticsData(formattedData);

        const latest = formattedData[formattedData.length - 1];
        if (latest) {
          setSensorData({
            humidity: latest.humidity,
            temperature: latest.temperature,
            soilMoisture: latest.soilMoisture,
          });
          setMotorStatus(latest.motor === 1 ? "On" : "Off");

          setPlantDiseaseStatus(
            latest.has_diseased === 1 ? "⚠️ The plant is diseased" : "✅ The plant is healthy"
          );
        }

        // Motor Duration Logic
        const durations = [];
        let startTime = null;
        for (let i = 0; i < formattedData.length; i++) {
          if (formattedData[i].motor === 1 && startTime === null) {
            startTime = new Date(formattedData[i].name);
          } else if (formattedData[i].motor === 0 && startTime !== null) {
            const endTime = new Date(formattedData[i].name);
            const duration = (endTime - startTime) / 1000; // seconds
            durations.push({
              name: formattedData[i].name,
              duration: duration.toFixed(1)
            });
            startTime = null;
          }
        }
        setMotorDurations(durations);

      } catch (error) {
        console.error('Error fetching all data:', error);
      }
    };

    const fetchLatestData = async () => {
      try {
        const response = await fetch('http://localhost:5001/latest-data');
        const data = await response.json();

        if (data.message === "No data found" || data.payload.mac !== userMac) return;

        const latestData = {
          humidity: data.payload.humidity,
          temperature: data.payload.temperature,
          soilMoisture: data.payload.moisture,
        };

        setSensorData(latestData);
        setMotorStatus(data.payload.motor === 1 ? "On" : "Off");

        setAnalyticsData(prevData => {
          const updated = [
            ...prevData.slice(-19),
            {
              name: data.payload.timestamp,
              temperature: data.payload.temperature,
              humidity: data.payload.humidity,
              soilMoisture: data.payload.moisture,
              motor: data.payload.motor,
              motorOnTimes: data.payload.motor === 1 ? 1 : 0,
              has_diseased: data.payload.has_diseased
            }
          ];
          return updated;
        });

        setPlantDiseaseStatus(
          data.payload.has_diseased === 1 ? "⚠️ The plant is diseased" : "✅ The plant is healthy"
        );

      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchLatestData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#1a202c",
      color: "white",
      minHeight: "100vh",
      overflowX: "hidden"
    }}>
      <h2>🌱 Smart Farming Dashboard</h2>

      <div style={{
        marginBottom: "20px",
        fontSize: "18px",
        fontWeight: "bold",
        color: plantDiseaseStatus?.includes("diseased") ? "#FF4500" : "#32CD32"
      }}>
        {plantDiseaseStatus}
      </div>

      {/* Circular Sensor Readings */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {Object.entries({
          "Soil Moisture": [sensorData.soilMoisture, 1024, "#FFA500"],
          "Temperature": [sensorData.temperature, 100, "#6495ED"],
          "Humidity": [sensorData.humidity, 100, "#32CD32"],
        }).map(([label, [value, max, color]]) => (
          <div key={label} style={{
            padding: "20px",
            backgroundColor: "#2d3748",
            borderRadius: "10px",
            textAlign: "center",
            width: "120px"
          }}>
            <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>{label}</h3>
            <div style={{ width: "80px", height: "80px", margin: "auto" }}>
              <CircularProgressbar
                value={value}
                maxValue={max}
                text={`${value}`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: color,
                  trailColor: "#333"
                })}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Motor Status Display */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Motor Status: {motorStatus}</h3>
        <div style={{
          display: "inline-block",
          margin: "5px",
          padding: "10px",
          backgroundColor: motorStatus === "On" ? "#32CD32" : "#555",
          borderRadius: "5px",
          boxShadow: motorStatus === "On" ? "0px 0px 15px 5px rgba(50, 205, 50, 0.8)" : "none",
        }}>Motor On</div>
        <div style={{
          display: "inline-block",
          margin: "5px",
          padding: "10px",
          backgroundColor: motorStatus === "Off" ? "#FF4500" : "#555",
          borderRadius: "5px",
          boxShadow: motorStatus === "Off" ? "0px 0px 15px 5px rgba(255, 69, 0, 0.8)" : "none",
        }}>Motor Off</div>
      </div>

      {/* Graphs Section */}
      <h3>📊 Analytics</h3>

      {/* First row of 4 graphs */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
        {[
          { title: "Temperature Trends", key: "temperature", type: "line", color: "#6495ED" },
          { title: "Soil Moisture Levels", key: "soilMoisture", type: "bar", color: "#FFA500" },
          { title: "Humidity Variations", key: "humidity", type: "area", color: "#32CD32" },
          { title: "Motor On Count", key: "motorOnTimes", type: "bar", color: "#FF4500" }
        ].map((graph, index) => (
          <div key={index} style={{
            width: "300px",
            height: "200px",
            backgroundColor: "#2d3748",
            borderRadius: "10px",
            padding: "10px"
          }}>
            <h4>{graph.title}</h4>
            <ResponsiveContainer width="100%" height="80%">
              {graph.type === "line" ? (
                <LineChart data={analyticsData}>
                  <XAxis dataKey="name" stroke="#fff" /><YAxis stroke="#fff" />
                  <Tooltip />
                  <Line type="monotone" dataKey={graph.key} stroke={graph.color} />
                </LineChart>
              ) : graph.type === "bar" ? (
                <BarChart data={analyticsData}>
                  <XAxis dataKey="name" stroke="#fff" /><YAxis stroke="#fff" />
                  <Tooltip />
                  <Bar dataKey={graph.key} fill={graph.color} />
                </BarChart>
              ) : (
                <AreaChart data={analyticsData}>
                  <XAxis dataKey="name" stroke="#fff" /><YAxis stroke="#fff" />
                  <Tooltip />
                  <Area type="monotone" dataKey={graph.key} stroke={graph.color} fill={graph.color} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Fifth analytic (motor ON durations) centered */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "30px",
        paddingBottom: "50px"
      }}>
        <div style={{
          width: "620px",
          height: "250px",
          backgroundColor: "#2d3748",
          borderRadius: "10px",
          padding: "10px"
        }}>
          <h4>Motor ON Duration (seconds)</h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={motorDurations}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="duration" fill="#00CED1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
