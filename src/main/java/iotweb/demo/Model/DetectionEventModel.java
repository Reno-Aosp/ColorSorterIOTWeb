package iotweb.demo.Model;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Model for color detection events.
 * Database entity for storing detection data.
 */
@Entity
public class DetectionEventModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primary key
    
    private Instant ts; // Event timestamp UTC
    private String deviceId; // IoT device identifier
    private String colorName; // Detected color name
    private Integer r; // Red color value (0-255)
    private Integer g; // Green color value (0-255)
    private Integer b; // Blue color value (0-255)
    private Double confidence; // Detection confidence (0.0-1.0)
    private String binId; // Bin/chute identifier
    
    // Get primary key
    public Long getId() { return id; }
    
    // Set primary key
    public void setId(Long id) { this.id = id; }
    
    // Get event timestamp
    public Instant getTs() { return ts; }
    
    // Set event timestamp
    public void setTs(Instant ts) { this.ts = ts; }
    
    // Get device identifier
    public String getDeviceId() { return deviceId; }
    
    // Set device identifier
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    // Get detected color name
    public String getColorName() { return colorName; }
    
    // Set detected color name
    public void setColorName(String colorName) { this.colorName = colorName; }
    
    // Get red color value
    public Integer getR() { return r; }
    
    // Set red color value
    public void setR(Integer r) { this.r = r; }
    
    // Get green color value
    public Integer getG() { return g; }
    
    // Set green color value
    public void setG(Integer g) { this.g = g; }
    
    // Get blue color value
    public Integer getB() { return b; }
    
    // Set blue color value
    public void setB(Integer b) { this.b = b; }
    
    // Get detection confidence
    public Double getConfidence() { return confidence; }
    
    // Set detection confidence
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    
    // Get bin identifier
    public String getBinId() { return binId; }
    
    // Set bin identifier
    public void setBinId(String binId) { this.binId = binId; }
}