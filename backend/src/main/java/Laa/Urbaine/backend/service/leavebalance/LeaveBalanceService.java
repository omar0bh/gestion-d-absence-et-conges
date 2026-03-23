package Laa.Urbaine.backend.service.leavebalance;

import Laa.Urbaine.backend.dto.leavebalance.LeaveBalanceRequest;
import Laa.Urbaine.backend.entity.LeaveBalance;

import java.util.List;

public interface LeaveBalanceService {
    LeaveBalance createLeaveBalance(LeaveBalanceRequest request);
    List<LeaveBalance> getAllLeaveBalances();
    LeaveBalance getLeaveBalanceById(Long id);
    List<LeaveBalance> getBalancesByEmployee(Long employeeId);
}