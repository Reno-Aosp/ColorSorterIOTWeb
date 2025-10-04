package iotweb.demo.Controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DeviceStatusController {

    @GetMapping("/device-status")
    public Map<String, Object> getDeviceStatus() {
        Map<String, Object> status = new HashMap<>();
        
        // Simulate device status data
        status.put("deviceId", "ESP-ColorSensor-Enhanced");
        status.put("isOnline", true);
        status.put("voltage", 3.3);
        status.put("temperature", 25.0);
        status.put("wifiSignal", -45);
        status.put("memoryUsage", 65);
        status.put("lastSeen", LocalDateTime.now());
        status.put("uptime", 3600); // seconds
        
        Map<String, Integer> sensorData = new HashMap<>();
        sensorData.put("red", 150);
        sensorData.put("green", 200);
        sensorData.put("blue", 180);
        sensorData.put("clear", 100);
        status.put("sensorReadings", sensorData);
        
        return status;
    }
    
    @PostMapping("/device-control/{action}")
    public Map<String, Object> controlDevice(@PathVariable String action) {
        Map<String, Object> response = new HashMap<>();
        
        switch (action) {
            case "restart":
                response.put("success", true);
                response.put("message", "Device restart command sent");
                break;
            case "calibrate":
                response.put("success", true);
                response.put("message", "Sensor calibration started");
                break;
            case "diagnostics":
                response.put("success", true);
                response.put("message", "System diagnostics initiated");
                break;
            default:
                response.put("success", false);
                response.put("message", "Unknown command");
        }
        
        return response;
    }
}