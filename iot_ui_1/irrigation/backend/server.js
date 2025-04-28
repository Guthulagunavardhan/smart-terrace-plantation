require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// AWS DynamoDB Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME;

// Fetch latest data
app.get("/latest-data", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const data = await dynamoDB.scan(params).promise();
    
    if (data.Items.length === 0) {
      return res.json({ message: "No data found" });
    }

    // Sort data by timestamp (descending order) to get the latest entry
    const latestData = data.Items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).reverse()[0];

    res.json(latestData); // Return the latest entry
  } catch (error) {
    console.error("DynamoDB Error:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// New endpoint to fetch all data
app.get("/all-data", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const data = await dynamoDB.scan(params).promise();
    
    if (data.Items.length === 0) {
      return res.json({ message: "No data found" });
    }

    // Sort data by timestamp (ascending order) for chronological plotting
    const allData = data.Items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    res.json(allData);
  } catch (error) {
    console.error("DynamoDB Error:", error);
    res.status(500).json({ error: "Error fetching all data" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));