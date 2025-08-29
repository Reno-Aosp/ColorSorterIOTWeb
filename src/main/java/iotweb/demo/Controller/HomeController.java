package iotweb.demo.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    public HomeController() {
        System.out.println("HomeController created!");
    }
    
    @GetMapping("/")
    public String home() {
        System.out.println("Home endpoint called!");
        return "IOT Web API is running! Available endpoints: /api/events, /api/events/latest, /api/stats/colors, /api/events/stream";
    }
    
    @GetMapping("/test")
    public String test() {
        return "Test endpoint works!";
    }
}
