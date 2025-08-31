# IOT Color Detection System

A complete IoT color detection system with Spring Boot backend and React frontend for real-time color monitoring and analytics.

## System Architecture

- **Backend**: Spring Boot with Maven, H2 Database, JPA/Hibernate
- **Frontend**: React with Vite, Tailwind CSS
- **Real-time**: Server-Sent Events (SSE) for live updates
- **API**: RESTful endpoints for IoT device integration

## Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.6+

### 1. Clone and Setup
```bash
git clone <your-repo>
cd IOTWeb/demo
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd "D:\Colleges Files\IOTWeb\demo"

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory  
cd "D:\Colleges Files\IOTWeb\demo\src\main\resources\static\FrontEnd"

# Install dependencies
npm install

# Fix missing Vite plugin (if needed)
npm install @vitejs/plugin-react --save-dev

# Start development server
npm run dev
```

## Available Endpoints

### Backend API (http://localhost:1000)
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/` | GET | Home page | Working |
| `/test` | GET | Test endpoint | Working |
| `/api/events` | POST | **IoT data receiver** | Working |
| `/api/events/latest` | GET | Latest 20 detection events | Working |
| `/api/stats/colors` | GET | Color statistics | Working |
| `/api/events/stream` | GET | Real-time SSE stream | Working |
| `/actuator` | GET | Health monitoring endpoints | Working |
| `/actuator/health` | GET | Application health check | Working |

### Frontend Dashboard (http://localhost:5173)
- Real-time color detection dashboard
- Latest events table
- Color statistics and charts
- Live updates via Server-Sent Events

## IoT Device Integration

### Send Color Detection Data
**Endpoint**: `POST http://localhost:1000/api/events`

**JSON Format**:
```json
{
    "deviceId": "sensor-01",
    "colorName": "red",
    "r": 255,
    "g": 0,
    "b": 0,
    "confidence": 0.95,
    "binId": "bin-1",
    "ts": "2025-08-29T09:30:00Z"
}
```

### Example IoT Integration

**Arduino/ESP32**:
```cpp
#include <WiFi.h>
#include <HTTPClient.h>

void sendColorDetection(String color, int r, int g, int b) {
    HTTPClient http;
    http.begin("http://your-server:1000/api/events");
    http.addHeader("Content-Type", "application/json");
    
    String jsonData = "{\"deviceId\":\"sensor-01\",\"colorName\":\"" + color + 
                     "\",\"r\":" + r + ",\"g\":" + g + ",\"b\":" + b + 
                     ",\"confidence\":0.95}";
    
    int httpResponseCode = http.POST(jsonData);
    http.end();
}
```

**Python (Raspberry Pi)**:
```python
import requests

def send_color_detection(color, r, g, b):
    url = "http://your-server:1000/api/events"
    data = {
        "deviceId": "pi-sensor-01",
        "colorName": color,
        "r": r, "g": g, "b": b,
        "confidence": 0.95
    }
    response = requests.post(url, json=data)
    return response.status_code
```

## Development Setup

### Option 1: Separate Processes (Recommended)
```bash
# Terminal 1 - Backend
cd "D:\Colleges Files\IOTWeb\demo"
mvn spring-boot:run

# Terminal 2 - Frontend  
cd "D:\Colleges Files\IOTWeb\demo\src\main\resources\static\FrontEnd"
npm run dev
```

### Option 2: Combined (Production)
```bash
cd "D:\Colleges Files\IOTWeb\demo"
mvn clean install spring-boot:run
```

## Directory Navigation

### Adjust Backend Directory
```bash
cd "D:\Colleges Files\IOTWeb\demo"
```

### Adjust Frontend Directory
```bash
cd "D:\Colleges Files\IOTWeb\demo\src\main\resources\static\FrontEnd"
```

### Run Backend + Frontend Together
```bash
mvn clean install spring-boot:run
```

## Technologies Used

### Backend
- **Spring Boot 3.5.5** - Main framework
- **Spring Data JPA** - Database abstraction
- **H2 Database** - In-memory database
- **Hibernate** - ORM
- **Maven** - Dependency management
- **Spring Boot Actuator** - Monitoring

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Server-Sent Events** - Real-time updates

## Project Structure

```
IOTWeb/demo/
├── src/main/java/iotweb/demo/
│   ├── Controller/          # REST controllers
│   ├── Service/            # Business logic
│   ├── Repository/         # Data access
│   ├── DTO/               # Data transfer objects
│   └── Model/             # Entity models
├── src/main/resources/
│   ├── application.properties
│   └── static/FrontEnd/
│       ├── sourcecode/    # React components
│       ├── package.json
│       └── index.html
└── pom.xml               # Maven configuration
```

## Troubleshooting

### Common Issues

**Frontend not loading**:
```bash
# Check if file exists, should be 'style.css' not 'styles.css'
# In app.jsx, change import "./styles.css" to import "./style.css"
```

**Tailwind warnings**:
```bash
# Rename tailwindconfig.js to tailwind.config.js
ren tailwindconfig.js tailwind.config.js
```

**Database connection errors**:
```bash
# Make sure H2 dependency is in pom.xml
# Check application.properties for correct H2 settings
```

**CORS errors**:
```bash
# Backend is configured for http://localhost:5173
# Make sure frontend runs on this port
```

## Features

- Real-time color detection monitoring
- RESTful API for IoT device integration  
- Live dashboard with charts and tables
- Color statistics and analytics
- Server-Sent Events for real-time updates
- Health monitoring and actuator endpoints
- CORS configured for frontend integration
- In-memory H2 database for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## License

This project is licensed under the GNU

---

**Ready to detect colors in real-time!**
