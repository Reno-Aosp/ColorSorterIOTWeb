package iotweb.demo.Service;


<<<<<<< HEAD
import iotweb.demo.DTO.DetectionEvent;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;

=======
import iotweb.demo.colorsorter.dto.DetectionEventDTO;
import iotweb.demo.colorsorter.model.DetectionEvent;
import iotweb.demo.Repository.DetectionEventRepository;

import iotweb.demo.Model.DetectionEventModel;
>>>>>>> 3145818c0dec9fd022290da99166db45e992e709

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;


@Service
public class EventService {
private final DetectionEventModel repo;
private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();


<<<<<<< HEAD
public EventService(DetectionEventModel repo) {
     this.repo = repo;
     }


public DetectionEvent save(DetectionEvent dto) {
=======
public EventService(DetectionEventModel repo) { this.repo = repo; }


public DetectionEvent save(DetectionEventDTO dto) {
>>>>>>> 3145818c0dec9fd022290da99166db45e992e709
var e = new DetectionEvent();
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


private void broadcast(DetectionEvent e) {
<<<<<<< HEAD
    for (var em : emitters) {
        try {
            em.send(SseEmitter.event().name("event").data(e));
        } catch (IOException ex) {
            em.complete();
            emitters.remove(em);
        }
    }
=======
for (var em : emitters) {
try { em.send(SseEmitter.event().name("event").data(e)); }
catch (IOException ex) { em.complete(); emitters.remove(em); }
}
>>>>>>> 3145818c0dec9fd022290da99166db45e992e709
}
}