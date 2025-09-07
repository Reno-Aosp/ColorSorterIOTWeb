package iotweb.demo.DTO;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Entity for color detection events.
 * Represents IoT device color detection data.
 */
@Entity
public class DetectionEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primary key
    
    @NotBlank 
    public String deviceId;  // IoT device identifier
    
    @NotBlank 
    public String colorName;  // Detected color name
    
    @Min(0) @Max(255) 
    public Integer r;  // Red color value (0-255)
    
    @Min(0) @Max(255) 
    public Integer g;  // Green color value (0-255)
    
    @Min(0) @Max(255) 
    public Integer b;  // Blue color value (0-255)
    
    @DecimalMin("0.0") @DecimalMax("1.0") 
    public Double confidence;  // Detection confidence (0.0-1.0)
    
    public String binId;  // Bin identifier
    
    public String ts; // Timestamp (ISO string from device; if null, server uses now)
    
    // Get primary key
    public Long getId() { return id; }
    
    // Set primary key
    public void setId(Long id) { this.id = id; }
}