package iotweb.demo.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Home Controller for basic API endpoints.
 * Provides simple endpoints for testing and API information.
 */
@RestController
public class HomeController {
    
    public HomeController() {
        System.out.println("HomeController created!");
    }
    
    // GET root endpoint with API information
    @GetMapping("/")
    public String home() {
        System.out.println("Home endpoint called!");
        return "IOT Web API is running! Available endpoints: /api/events, /api/events/latest, /api/stats/colors, /api/events/stream";
    }
    
    // GET test endpoint for API connectivity
    @GetMapping("/test")
    public String test() {
        return "Test endpoint works!";
    }
}
