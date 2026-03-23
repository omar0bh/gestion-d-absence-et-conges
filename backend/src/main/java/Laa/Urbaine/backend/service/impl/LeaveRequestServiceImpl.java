package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.leaveapproval.LeaveApprovalRequest;
import Laa.Urbaine.backend.dto.leaverequest.LeaveDecisionRequest;
import Laa.Urbaine.backend.dto.leaverequest.LeaveRequestCreateRequest;
import Laa.Urbaine.backend.entity.*;
import Laa.Urbaine.backend.enums.ApprovalDecision;
import Laa.Urbaine.backend.enums.LeaveRequestStatus;
import Laa.Urbaine.backend.enums.ValidationLevel;
import Laa.Urbaine.backend.repository.*;
import Laa.Urbaine.backend.service.leaverequest.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;
    private final LeaveApprovalServiceImpl leaveApprovalService;

    @Override
    public LeaveRequest createLeaveRequest(LeaveRequestCreateRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId())
                .orElseThrow(() -> new RuntimeException("Leave type not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        int numberOfDays = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        LeaveBalance leaveBalance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employee.getId(), leaveType.getId(), request.getStartDate().getYear())
                .orElseThrow(() -> new RuntimeException("Leave balance not found for this employee and year"));

        if (leaveBalance.getRemainingDays() < numberOfDays) {
            throw new RuntimeException("Insufficient leave balance");
        }

        LeaveRequestStatus initialStatus = determineInitialStatus(employee, leaveType);

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .numberOfDays(numberOfDays)
                .reason(request.getReason())
                .status(initialStatus)
                .currentStep(1)
                .createdAt(LocalDateTime.now())
                .build();

        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    @Override
    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
    }

    @Override
    public List<LeaveRequest> getRequestsByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    @Override
    public LeaveRequest approveRequest(Long requestId, LeaveDecisionRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        User approver = userRepository.findById(request.getApproverUserId())
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        ValidationLevel currentLevel = getCurrentValidationLevel(leaveRequest.getStatus());

        leaveApprovalService.createApproval(
                LeaveApprovalRequest.builder()
                        .leaveRequestId(leaveRequest.getId())
                        .approverId(approver.getId())
                        .levelOrder(leaveRequest.getCurrentStep())
                        .levelName(currentLevel)
                        .decision(ApprovalDecision.APPROVED)
                        .comment(request.getComment())
                        .build()
        );

        LeaveRequestStatus nextStatus = determineNextStatusAfterApproval(
                leaveRequest.getEmployee(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStatus()
        );

        if (nextStatus == LeaveRequestStatus.APPROVED) {
            LeaveBalance balance = leaveBalanceRepository
                    .findByEmployeeIdAndLeaveTypeIdAndYear(
                            leaveRequest.getEmployee().getId(),
                            leaveRequest.getLeaveType().getId(),
                            leaveRequest.getStartDate().getYear()
                    )
                    .orElseThrow(() -> new RuntimeException("Leave balance not found"));

            balance.setRemainingDays(balance.getRemainingDays() - leaveRequest.getNumberOfDays());
            leaveBalanceRepository.save(balance);

            leaveRequest.setStatus(LeaveRequestStatus.APPROVED);
        } else {
            leaveRequest.setStatus(nextStatus);
            leaveRequest.setCurrentStep(leaveRequest.getCurrentStep() + 1);
        }

        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public LeaveRequest rejectRequest(Long requestId, LeaveDecisionRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        User approver = userRepository.findById(request.getApproverUserId())
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        ValidationLevel currentLevel = getCurrentValidationLevel(leaveRequest.getStatus());

        leaveApprovalService.createApproval(
                LeaveApprovalRequest.builder()
                        .leaveRequestId(leaveRequest.getId())
                        .approverId(approver.getId())
                        .levelOrder(leaveRequest.getCurrentStep())
                        .levelName(currentLevel)
                        .decision(ApprovalDecision.REJECTED)
                        .comment(request.getComment())
                        .build()
        );

        leaveRequest.setStatus(LeaveRequestStatus.REJECTED);
        return leaveRequestRepository.save(leaveRequest);
    }

    private LeaveRequestStatus determineInitialStatus(Employee employee, LeaveType leaveType) {
        String role = employee.getUser().getRole().name();

        if ("EMPLOYEE".equals(role)) {
            if (employee.getService() != null) return LeaveRequestStatus.PENDING_SERVICE;
            if (employee.getDivision() != null) return LeaveRequestStatus.PENDING_DIVISION;
            if (employee.getDepartment() != null) return LeaveRequestStatus.PENDING_DEPARTMENT;
            return LeaveRequestStatus.PENDING_HR;
        }

        if ("SERVICE_MANAGER".equals(role)) {
            if (employee.getDivision() != null) return LeaveRequestStatus.PENDING_DIVISION;
            if (employee.getDepartment() != null) return LeaveRequestStatus.PENDING_DEPARTMENT;
            return LeaveRequestStatus.PENDING_HR;
        }

        if ("DIVISION_MANAGER".equals(role)) {
            if (leaveType.isRequiresDirectorApproval()) return LeaveRequestStatus.PENDING_DIRECTOR;
            if (employee.getDepartment() != null) return LeaveRequestStatus.PENDING_DEPARTMENT;
            return LeaveRequestStatus.PENDING_HR;
        }

        if ("DEPARTMENT_MANAGER".equals(role) || "DIRECTOR".equals(role)) {
            if (leaveType.isRequiresDirectorApproval()) return LeaveRequestStatus.PENDING_DIRECTOR;
            return LeaveRequestStatus.PENDING_HR;
        }

        if ("HR".equals(role)) {
            if (leaveType.isRequiresDirectorApproval()) return LeaveRequestStatus.PENDING_DIRECTOR;
            return LeaveRequestStatus.APPROVED;
        }

        return LeaveRequestStatus.PENDING_HR;
    }

    private LeaveRequestStatus determineNextStatusAfterApproval(Employee employee, LeaveType leaveType, LeaveRequestStatus currentStatus) {
        return switch (currentStatus) {
            case PENDING_SERVICE -> employee.getDivision() != null
                    ? LeaveRequestStatus.PENDING_DIVISION
                    : employee.getDepartment() != null
                    ? LeaveRequestStatus.PENDING_DEPARTMENT
                    : LeaveRequestStatus.PENDING_HR;

            case PENDING_DIVISION -> employee.getDepartment() != null
                    ? LeaveRequestStatus.PENDING_DEPARTMENT
                    : LeaveRequestStatus.PENDING_HR;

            case PENDING_DEPARTMENT -> leaveType.isRequiresDirectorApproval()
                    ? LeaveRequestStatus.PENDING_DIRECTOR
                    : LeaveRequestStatus.PENDING_HR;

            case PENDING_HR -> leaveType.isRequiresDirectorApproval()
                    ? LeaveRequestStatus.PENDING_DIRECTOR
                    : LeaveRequestStatus.APPROVED;

            case PENDING_DIRECTOR -> LeaveRequestStatus.APPROVED;

            default -> LeaveRequestStatus.APPROVED;
        };
    }

    private ValidationLevel getCurrentValidationLevel(LeaveRequestStatus status) {
        return switch (status) {
            case PENDING_SERVICE -> ValidationLevel.SERVICE;
            case PENDING_DIVISION -> ValidationLevel.DIVISION;
            case PENDING_DEPARTMENT -> ValidationLevel.DEPARTMENT;
            case PENDING_HR -> ValidationLevel.HR;
            case PENDING_DIRECTOR -> ValidationLevel.DIRECTOR;
            default -> ValidationLevel.HR;
        };
    }
}