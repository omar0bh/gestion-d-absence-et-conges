package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.dto.division.DivisionRequest;
import Laa.Urbaine.backend.entity.Division;
import Laa.Urbaine.backend.service.division.DivisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/divisions")
@RequiredArgsConstructor
public class DivisionController {

    private final DivisionService divisionService;

    @PostMapping
    public ResponseEntity<Division> createDivision(@Valid @RequestBody DivisionRequest request) {
        return ResponseEntity.ok(divisionService.createDivision(request));
    }

    @GetMapping
    public ResponseEntity<List<Division>> getAllDivisions() {
        return ResponseEntity.ok(divisionService.getAllDivisions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Division> getDivisionById(@PathVariable Long id) {
        return ResponseEntity.ok(divisionService.getDivisionById(id));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Division>> getDivisionsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(divisionService.getDivisionsByDepartment(departmentId));
    }
}