package iotweb.demo.Repository;

/**
 * Repository interface for color count projections.
 * Used for custom queries returning color statistics.
 */
public interface ColorCountRepository {
    
    // Get color name from projection
    String getColorName();
    
    // Get count of detections for this color
    long getCount();
}