package iotweb.demo.DTO;

public class ColorCount {
    private String color;
    private Long count;

    public ColorCount(String color, Long count) {
        this.color = color;
        this.count = count;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
