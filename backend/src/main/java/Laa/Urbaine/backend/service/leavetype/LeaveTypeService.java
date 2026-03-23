package Laa.Urbaine.backend.service.leavetype;

import Laa.Urbaine.backend.dto.leavetype.LeaveTypeRequest;
import Laa.Urbaine.backend.entity.LeaveType;

import java.util.List;

public interface LeaveTypeService {
    LeaveType createLeaveType(LeaveTypeRequest request);
    List<LeaveType> getAllLeaveTypes();
    LeaveType getLeaveTypeById(Long id);
}