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
    
    // Custom query to count detections by color
    @Query("select e.colorName as colorName, count(e) as count from DetectionEvent e group by e.colorName")
    List<ColorCount> countByColor();
}