package iotweb.demo.Service;



import iotweb.demo.DTO.DetectionEventDTO;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;


import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


@Service
public class EventService {
private final DetectionEventRepository repo;
private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();



public EventService(DetectionEventRepository repo) {
     this.repo = repo;
     }


public DetectionEventModel save(DetectionEventDTO dto) {

var e = new DetectionEventModel();
e.setTs(dto.ts != null ? Instant.parse(dto.ts) : Instant.now());
e.setDeviceId(dto.deviceId);
e.setColorName(dto.colorName);
e.setR(dto.r); e.setG(dto.g); e.setB(dto.b);
e.setConfidence(dto.confidence);
e.setBinId(dto.binId);
var saved = repo.save(e);
broadcast(saved);
return saved;
}


public SseEmitter registerEmitter() {
SseEmitter emitter = new SseEmitter(0L); // no timeout
emitters.add(emitter);
emitter.onCompletion(() -> emitters.remove(emitter));
emitter.onTimeout(() -> emitters.remove(emitter));
return emitter;
}


private void broadcast(DetectionEventModel e) {

    for (var em : emitters) {
        try {
            em.send(SseEmitter.event().name("event").data(e));
        } catch (IOException ex) {
            em.complete();
            emitters.remove(em);
        }
    }
}
}