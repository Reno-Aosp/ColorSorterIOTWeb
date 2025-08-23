package iotweb.demo.Model;


import jakarta.persistence.*;
import java.time.Instant;


@Entity
public class DetectionEventModel {
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private Instant ts; // event timestamp UTC
private String deviceId; // e.g., sorter-01
private String colorName; // e.g., RED/GREEN/BLUE/YELLOW
private Integer r;
private Integer g;
private Integer b;
private Double confidence; // 0..1
private String binId; // which chute/bin used


// getters/setters
public Long getId() { return id; }
public void setId(Long id) { this.id = id; }
public Instant getTs() { return ts; }
public void setTs(Instant ts) { this.ts = ts; }
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
}