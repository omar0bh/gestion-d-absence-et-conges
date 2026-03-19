package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.dto.serviceentity.ServiceEntityRequest;
import Laa.Urbaine.backend.entity.ServiceEntity;
import Laa.Urbaine.backend.service.serviceentity.ServiceEntityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceEntityController {

    private final ServiceEntityService serviceEntityService;

    @PostMapping
    public ResponseEntity<ServiceEntity> createService(@Valid @RequestBody ServiceEntityRequest request) {
        return ResponseEntity.ok(serviceEntityService.createService(request));
    }

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices() {
        return ResponseEntity.ok(serviceEntityService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceEntityService.getServiceById(id));
    }

    @GetMapping("/division/{divisionId}")
    public ResponseEntity<List<ServiceEntity>> getServicesByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(serviceEntityService.getServicesByDivision(divisionId));
    }
}