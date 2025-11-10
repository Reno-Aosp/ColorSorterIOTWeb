package iotweb.demo.Controller;

import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class DetectionEventController {
    @Autowired
    private DetectionEventRepository repository;

    private final Map<String, Object> latestStatus = new HashMap<>();

    // Helper: treat no-detection as white/none/empty
    private boolean isNoDetectionColor(String color) {
        if (color == null) return true;
        String c = color.trim().toLowerCase();
        return c.isEmpty() || c.equals("white") || c.equals("none") || c.equals("no_detection");
    }

    @GetMapping
    public ResponseEntity<List<DetectionEventModel>> getAllEvents() {
        try {
            System.out.println("📡 GET /api/events called");
            List<DetectionEventModel> events = repository.findAll();
            System.out.println("✅ Found " + events.size() + " events");
            
            // Log each event for debugging
            events.forEach(event -> {
                System.out.println("  - Event ID: " + event.getId() + 
                                 ", Color: " + event.getColorName() + 
                                 ", Timestamp: " + event.getTimestamp());
            });
            
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("❌ ERROR in getAllEvents!");
            System.err.println("❌ Error Type: " + e.getClass().getName());
            System.err.println("❌ Error Message: " + e.getMessage());
            System.err.println("❌ Full Stack Trace:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody DetectionEventModel event) {
        try {
            String color = event.getColorName();
            
            // Default to white if null/empty
            if (color == null || color.trim().isEmpty()) {
                color = "white";
            }
            
            System.out.println("📡 POST /api/events called for color: " + color);
            
            // Do NOT persist no-detection (white/none)
            if (isNoDetectionColor(color)) {
                System.out.println("⚪ Skipping white/no-detection - not saving to DB");
                return ResponseEntity.noContent().build(); // 204 No Content
            }
            
            // Yellow and other colors are saved normally
            event.setColorName(color);
            event.setTimestamp(LocalDateTime.now());
            DetectionEventModel saved = repository.save(event);
            System.out.println("✅ Event saved with ID: " + saved.getId() + " (Color: " + color + ")");
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.err.println("❌ Error saving event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<DetectionEventModel>> getRecentEvents(
            @RequestParam(defaultValue = "50") int limit) {
        try {
            List<DetectionEventModel> events = repository.findAll().stream()
                    .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                    .limit(limit)
                    .toList();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("❌ Error getting recent events: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAllEvents() {
        try {
            System.out.println("🗑️ DELETE /api/events called - Clearing all history");
            long count = repository.count();
            repository.deleteAll();
            System.out.println("✅ Deleted " + count + " events");
            return ResponseEntity.ok("Successfully deleted " + count + " events");
        } catch (Exception e) {
            System.err.println("❌ Error deleting events: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/device-status/update")
    public Map<String, Object> updateDeviceStatus(@RequestBody Map<String, Object> deviceData) {
        latestStatus.put("deviceId", deviceData.getOrDefault("deviceId", "ESP-ColorSensor-Enhanced"));
        latestStatus.put("isOnline", true);
        latestStatus.put("voltage", deviceData.get("voltage"));
        latestStatus.put("temperature", deviceData.get("temperature"));
        latestStatus.put("wifiSignal", deviceData.get("wifiSignal"));
        latestStatus.put("memoryUsage", deviceData.get("memoryUsage"));
        latestStatus.put("lastSeen", LocalDateTime.now());
        latestStatus.put("uptime", deviceData.get("uptime"));
        latestStatus.put("sensorReadings", deviceData.get("sensorReadings"));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Status updated");
        return response;
    }
}