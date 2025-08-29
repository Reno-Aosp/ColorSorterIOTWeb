package iotweb.demo.DTO;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class DetectionEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // ← Add this primary key field
    
    @NotBlank 
    public String deviceId;
    
    @NotBlank 
    public String colorName;
    
    @Min(0) @Max(255) 
    public Integer r;
    
    @Min(0) @Max(255) 
    public Integer g;
    
    @Min(0) @Max(255) 
    public Integer b;
    
    @DecimalMin("0.0") @DecimalMax("1.0") 
    public Double confidence;
    
    public String binId;
    
    public String ts; // optional ISO string from device; if null, server uses now
    
    // Add getter and setter for id
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}