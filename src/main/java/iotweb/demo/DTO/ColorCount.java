package iotweb.demo.DTO;

public class ColorCount {
    private String colorName;
    private Long count;

    // Constructor for JPA query
    public ColorCount(String colorName, Long count) {
        this.colorName = colorName;
        this.count = count;
    }

    // Default constructor
    public ColorCount() {
    }

    // Getters and Setters
    public String getColorName() {
        return colorName;
    }

    public void setColorName(String colorName) {
        this.colorName = colorName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
