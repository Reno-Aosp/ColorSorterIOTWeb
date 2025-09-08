package iotweb.demo.Controller;

import iotweb.demo.DTO.DetectionEvent;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;
import iotweb.demo.Service.EventService;
import iotweb.demo.DTO.ColorCount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Map;
import java.time.Instant;

/**
 * Device information for registration
 */
class DeviceInfo {
    public String deviceId;
    public String deviceType;
    public String location;
}

/**
 * Calibration data for sensors
 */
class CalibrationData {
    public String sensorType;
    public Map<String, Object> parameters;
}

/**
 * Main API controller for IoT telemetry data.
 * Handles color detection events and statistics.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TelemetryController {

    @Autowired
    private DetectionEventRepository repo;

    @Autowired
    private EventService eventService;

    // POST endpoint for IoT devices to send color detection data
    @PostMapping("/events")
    public ResponseEntity<DetectionEventModel> ingest(@RequestBody DetectionEvent dto) {
        DetectionEventModel saved = eventService.processEvent(dto);
        return ResponseEntity.ok(saved);
    }

    // Batch upload for multiple sensors
    @PostMapping("/events/batch")
    public ResponseEntity<List<DetectionEventModel>> ingestBatch(@RequestBody List<DetectionEvent> events) {
        try {
            List<DetectionEventModel> savedEvents = new ArrayList<>();
            for (DetectionEvent dto : events) {
                DetectionEventModel saved = eventService.processEvent(dto);
                savedEvents.add(saved);
            }
            return ResponseEntity.ok(savedEvents);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Device registration endpoint
    @PostMapping("/devices/register")
    public ResponseEntity<String> registerDevice(@RequestBody DeviceInfo deviceInfo) {
        // Store device info (you can add DeviceInfo model later)
        return ResponseEntity.ok("✅ Device " + deviceInfo.deviceId + " registered successfully!");
    }

    // Get device status
    @GetMapping("/devices/{deviceId}/status")
    public ResponseEntity<Object> getDeviceStatus(@PathVariable String deviceId) {
        // Return device last seen, battery level, etc.
        return ResponseEntity.ok(Map.of(
            "deviceId", deviceId,
            "status", "online",
            "lastSeen", Instant.now(),
            "batteryLevel", "85%"
        ));
    }

    // Calibration endpoint for sensors
    @PostMapping("/devices/{deviceId}/calibrate")
    public ResponseEntity<String> calibrateSensor(@PathVariable String deviceId, @RequestBody CalibrationData data) {
        // Handle sensor calibration
        return ResponseEntity.ok("✅ " + deviceId + " calibrated successfully!");
    }

    // GET latest 20 detection events
    @GetMapping("/events/latest")
    public List<DetectionEventModel> getLatest() {
        return repo.findTop20ByOrderByTsDesc();
    }

    // GET color statistics
    @GetMapping("/stats/colors")
    public List<ColorCount> getColorStats() {
        return repo.countByColor();
    }

    // NEW: Stream endpoint for real-time event streaming
    @GetMapping("/events/stream")
    public SseEmitter streamEvents() {
        return eventService.createEventStream();
    }

    // Debug endpoint to count all detection events
    @GetMapping("/debug/count")
    public long getEventCount() {
        return repo.count();
    }

    // Debug endpoint to retrieve all detection events
    @GetMapping("/debug/all")
    public List<DetectionEventModel> getAllEvents() {
        return repo.findAll();
    }

    // Debug endpoint to get raw color data from all events
    @GetMapping("/debug/colors-raw")
    @ResponseBody
    public List<String> getColorsRaw() {
        return repo.findAll().stream()
            .map(e -> "Color: " + e.getColorName() + ", Device: " + e.getDeviceId())
            .collect(Collectors.toList());
    }

    // NEW: Clear endpoint
    @DeleteMapping("/events/clear")
    public ResponseEntity<String> clearAllEvents() {
        try {
            long count = repo.count();
            repo.deleteAll();
            return ResponseEntity.ok("✅ Cleared " + count + " color detection events successfully!");
        } catch (Exception e) {
            System.err.println("Error clearing data: " + e.getMessage());
            return ResponseEntity.status(500).body("❌ Error clearing data: " + e.getMessage());
        }
    }

    // Optional: Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("🎨 Color Sorter API is healthy!");
    }
}