package iotweb.demo.Service;

import iotweb.demo.DTO.DetectionEvent;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private DetectionEventRepository repository;

    public DetectionEventModel save(DetectionEvent dto) {
        DetectionEventModel event = new DetectionEventModel();
        
        event.setDeviceId(dto.getDeviceId());
        event.setColorName(dto.getColorName());
        event.setR(dto.getR());
        event.setG(dto.getG());
        event.setB(dto.getB());
        event.setConfidence(dto.getConfidence());
        event.setBinId(dto.getBinId());
        
        // Set timestamp - use dto timestamp if present, otherwise use current time
        if (dto.getTimestamp() != null) {
            event.setTimestamp(dto.getTimestamp());
        } else {
            event.setTimestamp(LocalDateTime.now());
        }
        
        return repository.save(event);
    }

    public List<DetectionEventModel> findAll() {
        return repository.findAll();
    }

    public List<DetectionEventModel> findByDeviceId(String deviceId) {
        return repository.findByDeviceId(deviceId);
    }
}