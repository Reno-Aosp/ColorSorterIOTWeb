package iotweb.demo.Config;

/**
 * Configuration class for setting up Cross-Origin Resource Sharing (CORS).
 * Allows the frontend (React app) running on http://localhost:5173 to access the backend APIs.
 */
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    /**
     * Defines the CORS configuration for the entire application.
     * - Allows requests from http://localhost:5173
     * - Allows all HTTP methods and headers
     * - Supports credentials (cookies, authorization headers, etc.)
     * 
     * @return CorsConfigurationSource for Spring Security to use
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow frontend origin
        configuration.addAllowedOrigin("http://localhost:5173");
        // Allow all HTTP methods (GET, POST, etc.)
        configuration.addAllowedMethod("*");
        // Allow all headers
        configuration.addAllowedHeader("*");
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Apply this configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
