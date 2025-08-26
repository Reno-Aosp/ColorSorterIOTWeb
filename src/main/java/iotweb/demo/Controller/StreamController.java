package iotweb.demo.Controller;


<<<<<<< HEAD
import iotweb.demo.Service.EventService;
=======
import com.example.colorsorter.service.EventService;
>>>>>>> 3145818c0dec9fd022290da99166db45e992e709
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RestController
public class StreamController {
private final EventService service;
public StreamController(EventService service) { this.service = service; }


@GetMapping("/api/events/stream")
public SseEmitter stream() { return service.registerEmitter(); }
}