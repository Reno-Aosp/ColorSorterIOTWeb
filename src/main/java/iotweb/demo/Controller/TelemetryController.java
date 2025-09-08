package iotweb.demo.Controller;

import iotweb.demo.DTO.DetectionEvent;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;
import iotweb.demo.Service.EventService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import iotweb.demo.DTO.ColorCount;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Main API controller for IoT telemetry data.
 * Handles color detection events and statistics.
 */
@RestController
@RequestMapping("/api")
public class TelemetryController {
    private final EventService service;
    private final DetectionEventRepository repo;

    public TelemetryController(EventService service, DetectionEventRepository repo) {
        this.service = service; 
        this.repo = repo;
    }

    // POST endpoint for IoT devices to send color detection data
    @PostMapping("/events")
    public ResponseEntity<DetectionEventModel> ingest(@Valid @RequestBody DetectionEvent dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    // GET latest 20 detection events
    @GetMapping("/events/latest")
    public List<DetectionEventModel> latest() {
        return repo.findTop20ByOrderByTsDesc();
    }

    // GET color statistics
    @GetMapping("/stats/colors")
    public List<ColorCount> byColor() {
        return repo.countByColor();
    }

    // GET info about the POST endpoint
    @GetMapping("/events")
    public String eventsInfo() {
        return "This is a POST endpoint. Send JSON data to submit detection events.";
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
}