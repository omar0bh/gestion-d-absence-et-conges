package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.dto.leaverequest.LeaveDecisionRequest;
import Laa.Urbaine.backend.dto.leaverequest.LeaveRequestCreateRequest;
import Laa.Urbaine.backend.entity.LeaveRequest;
import Laa.Urbaine.backend.service.leaverequest.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@Valid @RequestBody LeaveRequestCreateRequest request) {
        return ResponseEntity.ok(leaveRequestService.createLeaveRequest(request));
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getRequestsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveRequestService.getRequestsByEmployee(employeeId));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<LeaveRequest> approveRequest(
            @PathVariable Long id,
            @Valid @RequestBody LeaveDecisionRequest request
    ) {
        return ResponseEntity.ok(leaveRequestService.approveRequest(id, request));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<LeaveRequest> rejectRequest(
            @PathVariable Long id,
            @Valid @RequestBody LeaveDecisionRequest request
    ) {
        return ResponseEntity.ok(leaveRequestService.rejectRequest(id, request));
    }
}