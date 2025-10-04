package iotweb.demo.Controller;

import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class DetectionEventController {

    @Autowired
    private DetectionEventRepository repository;

    @GetMapping
    public ResponseEntity<List<DetectionEventModel>> getAllEvents() {
        try {
            System.out.println("📡 GET /api/events called");
            List<DetectionEventModel> events = repository.findAll();
            System.out.println("✅ Found " + events.size() + " events");
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("❌ Error in getAllEvents: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<DetectionEventModel> createEvent(@RequestBody DetectionEventModel event) {
        try {
            System.out.println("📡 POST /api/events called for color: " + event.getColorName());
            event.setTimestamp(LocalDateTime.now());
            DetectionEventModel saved = repository.save(event);
            System.out.println("✅ Event saved with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
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
}