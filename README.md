# smart-terrace-plantation
DEMO OF THE PROJECT 
https://amritavishwavidyapeetham-my.sharepoint.com/:f:/g/personal/cb_en_u4cse22220_cb_students_amrita_edu/EqUWPbB7-MtMgfQftWUAN6QB2ESQQxx1__syBbrk9X7dJA?e=5qpouW

The Smart Terrace Plantation project aims to automate the irrigation process, monitor the plant health, and detect diseases in plant leaves using deep learning models. The system uses various sensors such as humidity sensors, temperature sensors, soil moisture sensors, and motor pumps to optimize plant growth. 

## Features

- **Automated Irrigation System**: The system monitors soil moisture levels and activates the water pump when the soil is dry, ensuring efficient watering.
- **Disease Detection**: A camera analyses the plant leaves, detecting diseases using deep learning models like YOLO for classification and MobileNet for leaf detection.
- **Real-time Data Visualization**: The system tracks temperature, humidity, and soil moisture levels and displays the data through time-series graphs.
- **Edge Computing**: 
  - **End Node**: ESP32, which collects sensor data and controls the motor pump.
  - **Edge Node**: Raspberry Pi 4, which processes the data and displays the analysis.
- **Database**: DynamoDB is used to store sensor data.
- **Communication**: MQTT with Mosquitto is used for communication between devices, and the data is displayed in time-series graphs.
- **TIG (Time-Series Ingestion)**: Sensors are implemented using TIG to handle data collection and management.

## Components Used

- **ESP32**: Used as the end node to collect sensor data (temperature, humidity, soil moisture) and control the water relay module and motor pump.
- **Raspberry Pi 4**: Used as the edge node to display analysis and perform high-level data processing, including disease detection.
- **DHT11**: Temperature and humidity sensor.
- **Soil Moisture Sensor**: Measures soil moisture level to trigger the water pump.
- **Relay Module**: Controls the water pump to start/stop based on soil moisture levels.
- **Camera**: Captures images of plant leaves for disease detection.
- **YOLO (You Only Look Once)**: Deep learning model used for classifying diseases in the plant leaves.
- **MobileNet**: Used for detecting the presence of leaves and performing analysis.

## Project Setup

### Prerequisites

1. **Hardware**
   - ESP32
   - Raspberry Pi 4
   - DHT11 Sensor (for temperature and humidity)
   - Soil Moisture Sensor
   - Relay Module
   - Motor Pump
   - Camera for disease detection
2. **Software**
   - Arduino IDE for programming the ESP32
   - Python (for Raspberry Pi and deep learning model)
   - MQTT broker (Mosquitto)
   - AWS DynamoDB for data storage

### Steps to Run the Project

1. **Set up the ESP32**: 
   - Connect the sensors to the ESP32.
   - Flash the ESP32 with the provided code to read sensor data and control the relay.
   - Configure Wi-Fi settings and MQTT for communication.

2. **Set up the Raspberry Pi**:
   - Install Python and required libraries for running the deep learning models.
   - Configure the Raspberry Pi to communicate with the ESP32 via MQTT.
   - Set up the camera for leaf disease detection and integrate YOLO and MobileNet models.

3. **Set up the Database**:
   - Create a DynamoDB table for storing sensor data.
   - Set up the necessary permissions for accessing DynamoDB.

4. **Run the system**:
   - Start the MQTT broker on the Raspberry Pi.
   - Ensure the ESP32 is collecting data and sending it to the Raspberry Pi via MQTT.
   - View the real-time data and analysis on the Raspberry Pi display.

## Contributing

1. Fork the repository.
2. Clone your forked repository to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make the necessary changes and commit them.
5. Push the changes to your forked repository.
6. Submit a pull request with a description of your changes.

## License

This project is licensed under the MIT License.

---

For more information, please refer to the official documentation.
