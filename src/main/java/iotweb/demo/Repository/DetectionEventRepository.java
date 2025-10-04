package iotweb.demo.Repository;

import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.DTO.ColorCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetectionEventRepository extends JpaRepository<DetectionEventModel, Long> {
    
    List<DetectionEventModel> findByDeviceId(String deviceId);
    
    @Query("SELECT new iotweb.demo.DTO.ColorCount(d.colorName, COUNT(d)) FROM DetectionEventModel d GROUP BY d.colorName")
    List<ColorCount> countByColor();
}