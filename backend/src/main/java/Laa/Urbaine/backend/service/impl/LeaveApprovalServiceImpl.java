package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.leaveapproval.LeaveApprovalRequest;
import Laa.Urbaine.backend.entity.LeaveApproval;
import Laa.Urbaine.backend.entity.LeaveRequest;
import Laa.Urbaine.backend.entity.User;
import Laa.Urbaine.backend.repository.LeaveApprovalRepository;
import Laa.Urbaine.backend.repository.LeaveRequestRepository;
import Laa.Urbaine.backend.repository.UserRepository;
import Laa.Urbaine.backend.service.leaveapproval.LeaveApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveApprovalServiceImpl implements LeaveApprovalService {

    private final LeaveApprovalRepository leaveApprovalRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    @Override
    public LeaveApproval createApproval(LeaveApprovalRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(request.getLeaveRequestId())
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        User approver = userRepository.findById(request.getApproverId())
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        LeaveApproval leaveApproval = LeaveApproval.builder()
                .leaveRequest(leaveRequest)
                .approver(approver)
                .levelOrder(request.getLevelOrder())
                .levelName(request.getLevelName())
                .decision(request.getDecision())
                .comment(request.getComment())
                .decidedAt(LocalDateTime.now())
                .build();

        return leaveApprovalRepository.save(leaveApproval);
    }

    @Override
    public List<LeaveApproval> getApprovalsByLeaveRequest(Long leaveRequestId) {
        return leaveApprovalRepository.findByLeaveRequestIdOrderByLevelOrderAsc(leaveRequestId);
    }
}