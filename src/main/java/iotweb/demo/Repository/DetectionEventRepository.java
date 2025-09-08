package iotweb.demo.Repository;

import iotweb.demo.DTO.ColorCount;
import iotweb.demo.Model.DetectionEventModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

/**
 * Repository for DetectionEventModel entities.
 * Provides database access and custom queries for color detection events.
 */
public interface DetectionEventRepository extends JpaRepository<DetectionEventModel, Long> {
    
    // Get latest 20 events ordered by timestamp descending
    List<DetectionEventModel> findTop20ByOrderByTsDesc();
    
    // Use native SQL query to be 100% sure
    @Query(value = "SELECT color_name as colorName, COUNT(*) as count FROM detection_event_model GROUP BY color_name", nativeQuery = true)
    List<ColorCount> countByColor();
}