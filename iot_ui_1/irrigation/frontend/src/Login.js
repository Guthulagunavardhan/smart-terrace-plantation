import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    let macAddress = "";
  
    if (username === "admin" && password === "password") {
      macAddress = "84:0D:8E:AB:12:34";
    } else if (username === "user1" && password === "password") {
      macAddress = "34:98:7A:71:6E:90";
    } else if (username === "user2" && password === "password") {
      macAddress = "84:0D:8E:AB:90:12";
    } else {
      alert("Invalid credentials");
      return;
    }
  
    localStorage.setItem("username", username);
    localStorage.setItem("mac", macAddress);
    navigate("/dashboard");
  };
  

  return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        width: "350px",
      }}>
        <h2 style={{ color: "#1e3c72", marginBottom: "20px" }}>Roof to Roots🌱🏠</h2>
        <input
          type="text"
          placeholder="Username"
          style={{
            padding: "12px",
            margin: "10px 0",
            width: "90%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={{
            padding: "12px",
            margin: "10px 0",
            width: "90%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          style={{
            padding: "12px",
            marginTop: "15px",
            background: "#1e3c72",
            color: "white",
            border: "none",
            borderRadius: "6px",
            width: "100%",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
