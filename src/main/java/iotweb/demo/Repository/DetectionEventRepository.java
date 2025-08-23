package iotweb.demo.Repository;


import com.example.colorsorter.model.DetectionEvent;
import com.example.colorsorter.repo.projections.ColorCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface DetectionEventRepository extends JpaRepository<DetectionEventModel, Long> {
List<DetectionEventModel> findTop20ByOrderByTsDesc();


@Query("select e.colorName as colorName, count(e) as count from DetectionEvent e group by e.colorName")
List<ColorCount> countByColor();
}