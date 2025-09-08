package iotweb.demo.DTO;

public class DetectionEvent {
    public String deviceId;
    public String colorName;
    public Integer r;
    public Integer g;
    public Integer b;
    public Double confidence;
    public String binId;
    public String ts;  // Optional timestamp
    
    // Default constructor
    public DetectionEvent() {}
    
    // Getters and setters
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getColorName() { return colorName; }
    public void setColorName(String colorName) { this.colorName = colorName; }
    
    public Integer getR() { return r; }
    public void setR(Integer r) { this.r = r; }
    
    public Integer getG() { return g; }
    public void setG(Integer g) { this.g = g; }
    
    public Integer getB() { return b; }
    public void setB(Integer b) { this.b = b; }
    
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    
    public String getBinId() { return binId; }
    public void setBinId(String binId) { this.binId = binId; }
    
    public String getTs() { return ts; }
    public void setTs(String ts) { this.ts = ts; }
}