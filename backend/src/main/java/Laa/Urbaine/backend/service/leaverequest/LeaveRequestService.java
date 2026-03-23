package Laa.Urbaine.backend.service.leaverequest;

import Laa.Urbaine.backend.dto.leaverequest.LeaveDecisionRequest;
import Laa.Urbaine.backend.dto.leaverequest.LeaveRequestCreateRequest;
import Laa.Urbaine.backend.entity.LeaveRequest;

import java.util.List;

public interface LeaveRequestService {
    LeaveRequest createLeaveRequest(LeaveRequestCreateRequest request);
    List<LeaveRequest> getAllLeaveRequests();
    LeaveRequest getLeaveRequestById(Long id);
    List<LeaveRequest> getRequestsByEmployee(Long employeeId);
    LeaveRequest approveRequest(Long requestId, LeaveDecisionRequest request);
    LeaveRequest rejectRequest(Long requestId, LeaveDecisionRequest request);
}