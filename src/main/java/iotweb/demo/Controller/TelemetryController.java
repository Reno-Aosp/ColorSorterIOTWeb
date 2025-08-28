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

@RestController
@RequestMapping("/api")
public class TelemetryController {
    private final EventService service;
    private final DetectionEventRepository repo;

    public TelemetryController(EventService service, DetectionEventRepository repo) {
        this.service = service; 
        this.repo = repo;
    }

    @PostMapping("/events")
    public ResponseEntity<DetectionEventModel> ingest(@Valid @RequestBody DetectionEvent dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @GetMapping("/events/latest")
    public List<DetectionEventModel> latest() {
        return repo.findTop20ByOrderByTsDesc();
    }

    @GetMapping("/stats/colors")
    public List<ColorCount> byColor() {
        return repo.countByColor();
    }
}