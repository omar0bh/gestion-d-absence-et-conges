package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.entity.LeaveApproval;
import Laa.Urbaine.backend.service.leaveapproval.LeaveApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-approvals")
@RequiredArgsConstructor
public class LeaveApprovalController {

    private final LeaveApprovalService leaveApprovalService;

    @GetMapping("/request/{leaveRequestId}")
    public ResponseEntity<List<LeaveApproval>> getApprovalsByLeaveRequest(@PathVariable Long leaveRequestId) {
        return ResponseEntity.ok(leaveApprovalService.getApprovalsByLeaveRequest(leaveRequestId));
    }
}