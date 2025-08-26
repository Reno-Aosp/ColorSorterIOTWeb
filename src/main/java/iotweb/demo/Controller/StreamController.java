package iotweb.demo.Controller;


import iotweb.demo.Service.EventService;
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