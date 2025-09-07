package iotweb.demo.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration class for Spring MVC settings.
 * This class configures CORS (Cross-Origin Resource Sharing) to allow
 * the React frontend to communicate with the Spring Boot backend.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    /**
     * Configures CORS mappings for the entire application.
     * This method allows cross-origin requests from the frontend.
     * 
     * @param registry The CORS registry to configure
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Add CORS mapping for all endpoints (/**)
        // Allow requests from React frontend running on localhost:5173
        // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        // Allow all headers (Content-Type, Authorization, etc.)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
