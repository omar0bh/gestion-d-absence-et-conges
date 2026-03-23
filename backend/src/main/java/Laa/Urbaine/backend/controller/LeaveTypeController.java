package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.dto.leavetype.LeaveTypeRequest;
import Laa.Urbaine.backend.entity.LeaveType;
import Laa.Urbaine.backend.service.leavetype.LeaveTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    @PostMapping
    public ResponseEntity<LeaveType> createLeaveType(@Valid @RequestBody LeaveTypeRequest request) {
        return ResponseEntity.ok(leaveTypeService.createLeaveType(request));
    }

    @GetMapping
    public ResponseEntity<List<LeaveType>> getAllLeaveTypes() {
        return ResponseEntity.ok(leaveTypeService.getAllLeaveTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveType> getLeaveTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveTypeService.getLeaveTypeById(id));
    }
}