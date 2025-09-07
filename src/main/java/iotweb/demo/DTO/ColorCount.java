package iotweb.demo.DTO;

/**
 * DTO for color statistics.
 * Represents count of detections for each color.
 */
public class ColorCount {
    private String color;
    private Long count;

    public ColorCount(String color, Long count) {
        this.color = color;
        this.count = count;
    }

    // Get detected color name
    public String getColor() {
        return color;
    }

    // Set detected color name
    public void setColor(String color) {
        this.color = color;
    }

    // Get count of detections for this color
    public Long getCount() {
        return count;
    }

    // Set count of detections for this color
    public void setCount(Long count) {
        this.count = count;
    }
}
