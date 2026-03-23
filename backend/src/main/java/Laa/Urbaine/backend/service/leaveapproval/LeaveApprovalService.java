package Laa.Urbaine.backend.service.leaveapproval;

import Laa.Urbaine.backend.dto.leaveapproval.LeaveApprovalRequest;
import Laa.Urbaine.backend.entity.LeaveApproval;

import java.util.List;

public interface LeaveApprovalService {
    LeaveApproval createApproval(LeaveApprovalRequest request);
    List<LeaveApproval> getApprovalsByLeaveRequest(Long leaveRequestId);
}