package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.leavebalance.LeaveBalanceRequest;
import Laa.Urbaine.backend.entity.Employee;
import Laa.Urbaine.backend.entity.LeaveBalance;
import Laa.Urbaine.backend.entity.LeaveType;
import Laa.Urbaine.backend.repository.EmployeeRepository;
import Laa.Urbaine.backend.repository.LeaveBalanceRepository;
import Laa.Urbaine.backend.repository.LeaveTypeRepository;
import Laa.Urbaine.backend.service.leavebalance.LeaveBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveBalanceServiceImpl implements LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    @Override
    public LeaveBalance createLeaveBalance(LeaveBalanceRequest request) {
        if (leaveBalanceRepository.existsByEmployeeIdAndLeaveTypeIdAndYear(
                request.getEmployeeId(),
                request.getLeaveTypeId(),
                request.getYear()
        )) {
            throw new RuntimeException("Leave balance already exists for this employee, type and year");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId())
                .orElseThrow(() -> new RuntimeException("Leave type not found"));

        LeaveBalance leaveBalance = LeaveBalance.builder()
                .employee(employee)
                .leaveType(leaveType)
                .year(request.getYear())
                .remainingDays(request.getRemainingDays())
                .build();

        return leaveBalanceRepository.save(leaveBalance);
    }

    @Override
    public List<LeaveBalance> getAllLeaveBalances() {
        return leaveBalanceRepository.findAll();
    }

    @Override
    public LeaveBalance getLeaveBalanceById(Long id) {
        return leaveBalanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave balance not found"));
    }

    @Override
    public List<LeaveBalance> getBalancesByEmployee(Long employeeId) {
        return leaveBalanceRepository.findByEmployeeId(employeeId);
    }
}