package iotweb.demo.Repository;


<<<<<<< HEAD
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.ColorCountRepository;
=======
import com.example.colorsorter.model.DetectionEvent;
import com.example.colorsorter.repo.projections.ColorCount;
>>>>>>> 3145818c0dec9fd022290da99166db45e992e709
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface DetectionEventRepository extends JpaRepository<DetectionEventModel, Long> {
List<DetectionEventModel> findTop20ByOrderByTsDesc();


@Query("select e.colorName as colorName, count(e) as count from DetectionEvent e group by e.colorName")
List<ColorCount> countByColor();
}