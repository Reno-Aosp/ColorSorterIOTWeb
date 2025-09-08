# 🎨 IoT Color Sorter Dashboard

A complete real-time IoT color detection and sorting system with Spring Boot backend, React frontend, and live analytics dashboard.

## ✨ Features

- 🎯 **Real-time Color Detection** - Live monitoring of IoT sensor data
- 📊 **Interactive Dashboard** - Beautiful charts and analytics
- 🔄 **Live Updates** - Server-Sent Events for instant data refresh
- 🌈 **Color Analytics** - Pie charts, statistics, and trend analysis
- 📱 **IoT Integration** - RESTful API for any IoT device
- 💾 **Data Persistence** - H2 database with JPA/Hibernate
- 🗑️ **Data Management** - Clear history functionality
- 🔌 **Universal IoT Support** - Arduino, Raspberry Pi, Python, Mobile apps

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.6+

### 1. Backend Setup
```bash
# Navigate to project
cd "D:\Colleges Files\IOTWeb\demo"

# Install and run
mvn clean install
mvn spring-boot:run
```
**Backend running at:** `http://localhost:1000`

### 2. Frontend Setup
```bash
# Navigate to frontend
cd "D:\Colleges Files\IOTWeb\demo\src\main\resources\static\FrontEnd"

# Install dependencies
npm install

# Start development server
npm run dev
```
**Dashboard available at:** `http://localhost:5173`

## 🎛️ System Architecture

```
IoT Sensors → REST API → Spring Boot → H2 Database
                           ↓
React Dashboard ← SSE Stream ← Color Analytics
```

### Backend Stack
- **Spring Boot 3.5.5** - REST API & Business Logic
- **H2 Database** - In-memory data storage
- **JPA/Hibernate** - Data persistence layer
- **Server-Sent Events** - Real-time streaming

### Frontend Stack
- **React 18** - Interactive dashboard
- **Vite** - Development server
- **Tailwind CSS** - Modern styling
- **ECharts** - Beautiful visualizations
- **React Query** - Data fetching & caching

## 📡 API Endpoints

### 🟢 All Working Endpoints

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/events` | POST | **IoT Data Receiver** | ✅ Working |
| `/api/events/latest` | GET | Latest 20 detections | ✅ Working |
| `/api/stats/colors` | GET | Color statistics | ✅ Working |
| `/api/events/stream` | GET | Real-time SSE stream | ✅ Working |
| `/api/events/clear` | DELETE | **Clear all color history** | ✅ Working |
| `/api/health` | GET | Health monitoring | ✅ Working |

## 🤖 IoT Device Integration

### Send Color Detection Data
**Endpoint**: `POST http://localhost:1000/api/events`

**Required JSON Format**:
```json
{
    "deviceId": "sensor-01",
    "colorName": "red",
    "r": 255,
    "g": 0,
    "b": 0,
    "confidence": 0.95,
    "binId": "red-bin"
}
```

### 🧪 Testing with PowerShell

**Single Color Test**:
```powershell
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-01","colorName":"red","r":255,"g":0,"b":0,"confidence":0.95,"binId":"red-bin"}'
```

**🌈 Rainbow Test Suite**:
```powershell
# Red
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-01","colorName":"red","r":255,"g":0,"b":0,"confidence":0.95,"binId":"red-bin"}'

# Blue  
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-02","colorName":"blue","r":0,"g":0,"b":255,"confidence":0.88,"binId":"blue-bin"}'

# Green
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-03","colorName":"green","r":0,"g":255,"b":0,"confidence":0.92,"binId":"green-bin"}'

# Yellow
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-01","colorName":"yellow","r":255,"g":255,"b":0,"confidence":0.85,"binId":"yellow-bin"}'

# Purple
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-02","colorName":"purple","r":128,"g":0,"b":128,"confidence":0.90,"binId":"purple-bin"}'

# Orange
Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body '{"deviceId":"sensor-03","colorName":"orange","r":255,"g":165,"b":0,"confidence":0.87,"binId":"orange-bin"}'
```

**🗑️ Clear History Test**:
```powershell
# Clear all color history
Invoke-RestMethod -Uri "http://localhost:1000/api/events/clear" -Method DELETE
```

**🤖 Automated Sensor Simulator**:
```powershell
# Simulate real IoT sensors
$colors = @(
    @{name="red"; r=255; g=0; b=0},
    @{name="blue"; r=0; g=0; b=255},
    @{name="green"; r=0; g=255; b=0},
    @{name="yellow"; r=255; g=255; b=0},
    @{name="purple"; r=128; g=0; b=128},
    @{name="orange"; r=255; g=165; b=0}
)

$sensors = @("factory-sensor-A", "warehouse-sensor-B", "lab-sensor-C")

for ($i = 1; $i -le 20; $i++) {
    $color = $colors | Get-Random
    $sensor = $sensors | Get-Random
    $conf = [Math]::Round((Get-Random -Minimum 80 -Maximum 98) / 100, 2)
    
    $data = @{
        deviceId = $sensor
        colorName = $color.name
        r = $color.r
        g = $color.g
        b = $color.b
        confidence = $conf
        binId = "$($color.name)-bin"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:1000/api/events" -Method POST -ContentType "application/json" -Body $data
    Write-Host "✅ $sensor detected $($color.name)" -ForegroundColor Cyan
    Start-Sleep -Seconds 1
}
```

## 🔌 Real IoT Device Examples

### Arduino/ESP32 (Main Endpoint for Arduino Users)
**Endpoint**: `POST http://YOUR_IP_ADDRESS:1000/api/events`

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Your dashboard endpoint (replace with your IP)
const char* serverURL = "http://192.168.1.100:1000/api/events";

void setup() {
    Serial.begin(115200);
    
    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("✅ Connected to WiFi!");
}

void loop() {
    // Read your color sensor here
    String detectedColor = "red";  // Replace with actual sensor reading
    int r = 255, g = 0, b = 0;     // Replace with actual RGB values
    float confidence = 0.95;       // Replace with actual confidence
    
    // Send to dashboard
    sendColorDetection(detectedColor, r, g, b, confidence);
    
    delay(3000); // Wait 3 seconds
}

void sendColorDetection(String color, int r, int g, int b, float confidence) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");
        
        // Create JSON payload
        String json = "{";
        json += "\"deviceId\":\"Arduino-Sensor-01\",";
        json += "\"colorName\":\"" + color + "\",";
        json += "\"r\":" + String(r) + ",";
        json += "\"g\":" + String(g) + ",";
        json += "\"b\":" + String(b) + ",";
        json += "\"confidence\":" + String(confidence) + ",";
        json += "\"binId\":\"" + color + "-bin\"";
        json += "}";
        
        // Send POST request
        int httpCode = http.POST(json);
        
        if (httpCode == 200) {
            Serial.println("✅ Color sent: " + color);
        } else {
            Serial.println("❌ Failed to send color. Code: " + String(httpCode));
        }
        
        http.end();
    } else {
        Serial.println("❌ WiFi disconnected!");
    }
}
```

### Python (Raspberry Pi)
```python
import requests
import time
import random

def send_color_detection(device_id, color, r, g, b, confidence):
    url = "http://your-server:1000/api/events"
    data = {
        "deviceId": device_id,
        "colorName": color,
        "r": r,
        "g": g,
        "b": b,
        "confidence": confidence,
        "binId": f"{color}-bin"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print(f"✅ {device_id}: {color} detected")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

# Simulate color sensor
colors = [
    ("red", 255, 0, 0),
    ("green", 0, 255, 0),
    ("blue", 0, 0, 255),
    ("yellow", 255, 255, 0)
]

while True:
    color_name, r, g, b = random.choice(colors)
    confidence = random.uniform(0.8, 0.98)
    
    send_color_detection("pi-sensor-01", color_name, r, g, b, confidence)
    time.sleep(2)
```

## 📊 Dashboard Features

### 🎯 What You'll See
- **📈 Real-time Color Statistics** - Live counts and percentages
- **🥧 Interactive Pie Chart** - Visual color distribution
- **📋 Latest Detections Table** - Recent sensor data with timestamps
- **🔄 Auto-refresh** - Updates every 5 seconds via SSE
- **🗑️ Clear History Button** - Remove all data with one click

### 🎨 Supported Colors
The dashboard recognizes and color-codes:
- **Red** `#FF0000`
- **Blue** `#0000FF`  
- **Green** `#00FF00`
- **Yellow** `#FFFF00`
- **Purple** `#800080`
- **Orange** `#FFA500`
- **Pink** `#FFC0CB`
- **Brown** `#A52A2A`
- **Black** `#000000`
- **White** `#FFFFFF`
- **Gray** `#808080`

## ⚙️ Configuration

### Backend Configuration
```properties
# application.properties
server.port=1000
server.address=0.0.0.0  # Allow external IoT devices
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create-drop
```

### Frontend Configuration
```javascript
// client.js
const API = 'http://localhost:1000';
export const apiGet = (path) => fetch(`${API}${path}`).then(r => r.json());
export const sseUrl = `${API}/api/events/stream`;
```

## 🔧 Troubleshooting

### ❌ Common Issues & ✅ Solutions

**Backend 500 Error**:
```bash
# Ensure DetectionEventModel has default constructor
public DetectionEventModel() {}
```

**Frontend CORS Error**:
```bash
# Check API URL in client.js
const API = 'http://localhost:1000';  # ✅ Correct port
```

**Pie Chart Not Showing**:
```bash
# Add test data and check stats endpoint
curl http://localhost:1000/api/stats/colors
```

**Database Empty**:
```bash
# Data is in-memory, resets on restart
# Add test data after each restart
```

**Arduino Can't Connect**:
```bash
# Check your IP address
ipconfig | findstr "IPv4"
# Update Arduino code with correct IP
```

## 🎯 Testing Endpoints

### Health Check
```bash
curl http://localhost:1000/api/health
```

### View All Data
```bash
curl http://localhost:1000/api/events/latest
```

### Color Statistics
```bash
curl http://localhost:1000/api/stats/colors
```

### Clear History
```bash
curl -X DELETE http://localhost:1000/api/events/clear
```

## 📂 Project Structure

```
IOTWeb/demo/
├── src/main/java/iotweb/demo/
│   ├── Controller/TelemetryController.java     # REST API endpoints
│   ├── Model/DetectionEventModel.java         # JPA entity  
│   ├── Repository/DetectionEventRepository.java # Data access
│   ├── Service/EventService.java              # Business logic
│   └── DTO/DetectionEvent.java                # Data transfer object
├── src/main/resources/
│   ├── application.properties                 # Backend config
│   └── static/FrontEnd/                       # React dashboard
│       ├── sourcecode/
│       │   ├── components/PieChart.jsx        # Color visualization
│       │   ├── api/client.js                  # API client
│       │   └── app.jsx                        # Main dashboard
│       └── package.json                       # Frontend dependencies
└── pom.xml                                    # Maven dependencies
```

## 🎉 Success Indicators

When everything is working, you should see:
- ✅ Backend starts on port 1000
- ✅ Frontend loads on port 5173  
- ✅ Dashboard shows "Color Sorter Dashboard" title
- ✅ Pie chart displays after adding test data
- ✅ Table updates with new color detections
- ✅ Clear button works perfectly
- ✅ No console errors
- ✅ Real-time updates every 5 seconds

## 🚀 Next Steps

### Production Deployment
- Use persistent database (MySQL/PostgreSQL)
- Add authentication & authorization
- Implement data backup & recovery
- Add monitoring & alerting

### Enhanced Features
- Historical data analysis
- Export data to CSV/Excel
- Device management dashboard  
- Color sorting automation
- Machine learning color prediction

## 📄 License

This project is licensed under the GPL 3.0 License

---

**🎨 Your IoT Color Sorter Dashboard is ready! Start detecting colors in real-time!** 

**Dashboard URL**: http://localhost:5173
**API Base URL**: http://localhost:1000
**Arduino Endpoint**: `POST http://YOUR_IP:1000/api/events`