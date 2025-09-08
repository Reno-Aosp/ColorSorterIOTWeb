package iotweb.demo.Service;

import iotweb.demo.DTO.DetectionEvent;
import iotweb.demo.Model.DetectionEventModel;
import iotweb.demo.Repository.DetectionEventRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Service for handling color detection events.
 * Manages event persistence and real-time broadcasting.
 */
@Service
public class EventService {
    private final DetectionEventRepository repo;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public EventService(DetectionEventRepository repo) {
        this.repo = repo;
    }

    // Save detection event and broadcast to connected clients
    public DetectionEventModel save(DetectionEvent dto) {
        var e = new DetectionEventModel();
        e.setTs(dto.ts != null ? Instant.parse(dto.ts) : Instant.now());
        e.setDeviceId(dto.deviceId);
        e.setColorName(dto.colorName);
        e.setR(dto.r); 
        e.setG(dto.g); 
        e.setB(dto.b);
        e.setConfidence(dto.confidence);
        e.setBinId(dto.binId);
        var saved = repo.save(e);
        broadcast(saved);
        return saved;
    }

    // FIXED: Process event method
    public DetectionEventModel processEvent(DetectionEvent dto) {
        // Auto-assign bin if not provided
        if (dto.binId == null || dto.binId.isEmpty()) {
            dto.binId = determineBin(dto.colorName, dto.confidence);
        }
        return save(dto);
    }

    // FIXED: Create event stream method
    public SseEmitter createEventStream() {
        return registerEmitter();
    }

    // Register new SSE emitter for real-time updates
    public SseEmitter registerEmitter() {
        SseEmitter emitter = new SseEmitter(0L); // no timeout
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    // Broadcast event to all connected SSE clients
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

    // Add smart bin assignment logic
    public String determineBin(String colorName, double confidence) {
        // High confidence sorting
        if (confidence >= 0.90) {
            return switch (colorName.toLowerCase()) {
                case "red" -> "BIN_A_RED";
                case "blue" -> "BIN_B_BLUE"; 
                case "green" -> "BIN_C_GREEN";
                case "yellow" -> "BIN_D_YELLOW";
                case "purple" -> "BIN_E_PURPLE";
                case "orange" -> "BIN_F_ORANGE";
                default -> "BIN_Z_MIXED";
            };
        }
        // Low confidence - manual review bin
        else if (confidence >= 0.75) {
            return "BIN_MANUAL_REVIEW";
        }
        // Very low confidence - reject bin
        else {
            return "BIN_REJECT";
        }
    }
}