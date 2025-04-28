import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Papa from "papaparse";

const Dashboard1 = () => {
  const [motorStatus, setMotorStatus] = useState("Off");
  const [sensorData, setSensorData] = useState({ humidity: 0, temperature: 0, soilMoisture: 0 });
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch('http://localhost:5001/latest-data');
        const data = await response.json();
        
        const latestData = {
          humidity: data.payload.humidity,
          temperature: data.payload.temperature,
          soilMoisture: data.payload.moisture
        };
        
        setSensorData(latestData);
        setMotorStatus(data.payload.motor === 1 ? "On" : "Off");

        setAnalyticsData(prevData => [...prevData, {
          name: data.payload.timestamp,
          temperature: data.payload.temperature,
          humidity: data.payload.humidity,
          soilMoisture: data.payload.moisture,
          motorOnTimes: data.payload.motor === 1 ? 1 : 0
        }]);
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLatestData();
    const interval = setInterval(fetchLatestData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const formattedData = result.data.map((row) => ({
            name: row["Date & Time"],
            temperature: row["Temperature"],
            humidity: row["Humidity"],
            soilMoisture: row["Moisture"],
            motorOnTimes: row["Motor"] === 1 ? 1 : 0,
          }));
          setAnalyticsData(formattedData);
          const latest = formattedData[formattedData.length - 1];
          if (latest) {
            setSensorData({
              humidity: latest.humidity,
              temperature: latest.temperature,
              soilMoisture: latest.soilMoisture,
            });
          }
        },
      });
    }
  };

  const handleMotorOn = () => setMotorStatus("On");
  const handleMotorOff = () => setMotorStatus("Off");

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#1a202c", color: "white", minHeight: "100vh" }}>
      <h2>🌱 Smart Farming Dashboard</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} style={{ marginBottom: "20px" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {Object.entries({
          "Soil Moisture": [sensorData.soilMoisture, 1024, "#FFA500"],
          "Temperature": [sensorData.temperature, 100, "#6495ED"],
          "Humidity": [sensorData.humidity, 100, "#32CD32"],
        }).map(([label, [value, max, color]]) => (
          <div key={label} style={{ padding: "20px", backgroundColor: "#2d3748", borderRadius: "10px", textAlign: "center", width: "120px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>{label}</h3>
            <div style={{ width: "80px", height: "80px", margin: "auto" }}>
              <CircularProgressbar
                value={value}
                maxValue={max}
                text={`${value}`}
                styles={buildStyles({ textColor: "#fff", pathColor: color, trailColor: "#333" })}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#1a202c", color: "white" }}>
        <div style={{ marginBottom: "20px" }}>
          <h3>Motor Status: {motorStatus}</h3>
          <button onClick={handleMotorOn} style={{ margin: "5px", padding: "10px", backgroundColor: "#32CD32", borderRadius: "5px" }}>Motor On</button>
          <button onClick={handleMotorOff} style={{ margin: "5px", padding: "10px", backgroundColor: "#FF4500", borderRadius: "5px" }}>Motor Off</button>
        </div>
      </div>
      <h3 style={{ marginTop: "20px" }}>📊 Analytics</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {[
          ["Temperature Trends", "temperature", "#6495ED", LineChart, Line],
          ["Soil Moisture Levels", "soilMoisture", "#FFA500", BarChart, Bar],
          ["Humidity Variations", "humidity", "#32CD32", AreaChart, Area],
          ["Motor On Count", "motorOnTimes", "#FF4500", BarChart, Bar],
        ].map(([title, dataKey, color, ChartType, ChartComponent]) => (
          <div key={title} style={{ width: "300px", height: "200px", backgroundColor: "#2d3748", borderRadius: "10px", padding: "10px" }}>
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height="80%">
              <ChartType data={analyticsData}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <ChartComponent type="monotone" dataKey={dataKey} stroke={color} fill={color} />
              </ChartType>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard1;
