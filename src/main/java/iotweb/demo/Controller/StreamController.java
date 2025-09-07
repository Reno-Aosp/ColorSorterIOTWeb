package iotweb.demo.Controller;

import iotweb.demo.Service.EventService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Controller for Server-Sent Events (SSE) streaming.
 * Handles real-time color detection event updates.
 */
@RestController
public class StreamController {
    
    private final EventService service;
    
    public StreamController(EventService service) { 
        this.service = service; 
    }

    // GET endpoint for real-time event streaming
    @GetMapping("/api/events/stream")
    public SseEmitter stream() { 
        return service.registerEmitter(); 
    }
}