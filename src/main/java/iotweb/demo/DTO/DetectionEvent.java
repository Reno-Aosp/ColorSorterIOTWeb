package iotweb.demo.DTO;


import jakarta.validation.constraints.*;


public class DetectionEvent {
@NotBlank public String deviceId;
@NotBlank public String colorName;
@Min(0) @Max(255) public Integer r;
@Min(0) @Max(255) public Integer g;
@Min(0) @Max(255) public Integer b;
@DecimalMin("0.0") @DecimalMax("1.0") public Double confidence;
public String binId;
public String ts; // optional ISO string from device; if null, server uses now
}