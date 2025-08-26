package iotweb.demo.Controller;


<<<<<<< HEAD
import iotweb.demo.DTO.DetectionEvent;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;
import iotweb.demo.Repository.ColorCountRepository;
import iotweb.demo.Service.EventService;

=======
import com.example.colorsorter.dto.DetectionEventDTO;
import com.example.colorsorter.model.DetectionEvent;
import com.example.colorsorter.repo.DetectionEventRepository;
import com.example.colorsorter.repo.projections.ColorCount;
import com.example.colorsorter.service.EventService;

import iotweb.demo.Model.DetectionEventModel;
>>>>>>> 3145818c0dec9fd022290da99166db45e992e709
import jakarta.validation.Valid;

import org.hibernate.event.spi.EventSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api")
public class TelemetryController {
private final EventSource service;
private final DetectionEventModel repo;


public TelemetryController(EventService service, DetectionEventRepository repo) {
this.service = service; this.repo = repo;
}


@PostMapping("/events")
public ResponseEntity<DetectionEvent> ingest(@Valid @RequestBody DetectionEventDTO dto) {
return ResponseEntity.ok(service.save(dto));
}


@GetMapping("/events/latest")
public List<DetectionEvent> latest() {
return repo.findTop20ByOrderByTsDesc();
}


@GetMapping("/stats/colors")
public List<ColorCount> byColor() {
return repo.countByColor();
}
}