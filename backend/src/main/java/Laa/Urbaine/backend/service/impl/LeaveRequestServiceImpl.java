package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.dto.leaveapproval.LeaveApprovalRequest;
import Laa.Urbaine.backend.dto.leaverequest.LeaveDecisionRequest;
import Laa.Urbaine.backend.dto.leaverequest.LeaveRequestCreateRequest;
import Laa.Urbaine.backend.entity.Employee;
import Laa.Urbaine.backend.entity.LeaveBalance;
import Laa.Urbaine.backend.entity.LeaveRequest;
import Laa.Urbaine.backend.entity.LeaveType;
import Laa.Urbaine.backend.entity.User;
import Laa.Urbaine.backend.enums.ApprovalDecision;
import Laa.Urbaine.backend.enums.LeaveRequestStatus;
import Laa.Urbaine.backend.enums.ValidationLevel;
import Laa.Urbaine.backend.repository.EmployeeRepository;
import Laa.Urbaine.backend.repository.LeaveBalanceRepository;
import Laa.Urbaine.backend.repository.LeaveRequestRepository;
import Laa.Urbaine.backend.repository.LeaveTypeRepository;
import Laa.Urbaine.backend.repository.UserRepository;
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
                .findByEmployeeIdAndLeaveTypeIdAndYear(
                        employee.getId(),
                        leaveType.getId(),
                        request.getStartDate().getYear()
                )
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

        // Directeur + congé exceptionnel => approved مباشرة
        if (initialStatus == LeaveRequestStatus.APPROVED) {
            leaveBalance.setRemainingDays(leaveBalance.getRemainingDays() - numberOfDays);
            leaveBalanceRepository.save(leaveBalance);
        }

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

        LeaveRequestStatus currentStatus = leaveRequest.getStatus();

        if (currentStatus == LeaveRequestStatus.APPROVED || currentStatus == LeaveRequestStatus.REJECTED) {
            throw new RuntimeException("Request already finalized");
        }

        if (!roleMatchesStatus(approver.getRole().name(), currentStatus)) {
            throw new RuntimeException("This user is not allowed to approve at this stage");
        }

        ValidationLevel currentLevel = getCurrentValidationLevel(currentStatus);

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
                leaveRequest.getLeaveType(),
                currentStatus
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

        LeaveRequestStatus currentStatus = leaveRequest.getStatus();

        if (currentStatus == LeaveRequestStatus.APPROVED || currentStatus == LeaveRequestStatus.REJECTED) {
            throw new RuntimeException("Request already finalized");
        }

        if (!roleMatchesStatus(approver.getRole().name(), currentStatus)) {
            throw new RuntimeException("This user is not allowed to reject at this stage");
        }

        ValidationLevel currentLevel = getCurrentValidationLevel(currentStatus);

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

        // DIRECTOR
        if ("DIRECTOR".equals(role)) {
            if (isExceptional(leaveType)) {
                return LeaveRequestStatus.APPROVED;
            }
            return LeaveRequestStatus.PENDING_HR;
        }

        // HR
        if ("HR".equals(role)) {
            if (isExceptional(leaveType)) {
                return LeaveRequestStatus.PENDING_DIRECTOR;
            }
            return LeaveRequestStatus.APPROVED;
        }

        // باقي الناس: direct manager
        if (employee.getService() != null) {
            return LeaveRequestStatus.PENDING_SERVICE;
        }
        if (employee.getDivision() != null) {
            return LeaveRequestStatus.PENDING_DIVISION;
        }
        if (employee.getDepartment() != null) {
            return LeaveRequestStatus.PENDING_DEPARTMENT;
        }

        return LeaveRequestStatus.PENDING_HR;
    }

    private LeaveRequestStatus determineNextStatusAfterApproval(LeaveType leaveType, LeaveRequestStatus currentStatus) {
        // Autorisation d'absence => direct manager فقط
        if (isShortAbsence(leaveType)) {
            return switch (currentStatus) {
                case PENDING_SERVICE, PENDING_DIVISION, PENDING_DEPARTMENT -> LeaveRequestStatus.APPROVED;
                case PENDING_HR -> LeaveRequestStatus.APPROVED;
                default -> throw new RuntimeException("Invalid short absence workflow state");
            };
        }

        // Congé annuel + Congé maladie => direct manager -> HR -> APPROVED
        if (isStandardLeave(leaveType)) {
            return switch (currentStatus) {
                case PENDING_SERVICE, PENDING_DIVISION, PENDING_DEPARTMENT -> LeaveRequestStatus.PENDING_HR;
                case PENDING_HR -> LeaveRequestStatus.APPROVED;
                default -> throw new RuntimeException("Invalid standard leave workflow state");
            };
        }

        // Congé exceptionnel => direct manager -> department -> HR -> director -> approved
        if (isExceptional(leaveType)) {
            return switch (currentStatus) {
                case PENDING_SERVICE, PENDING_DIVISION -> LeaveRequestStatus.PENDING_DEPARTMENT;
                case PENDING_DEPARTMENT -> LeaveRequestStatus.PENDING_HR;
                case PENDING_HR -> LeaveRequestStatus.PENDING_DIRECTOR;
                case PENDING_DIRECTOR -> LeaveRequestStatus.APPROVED;
                default -> throw new RuntimeException("Invalid exceptional leave workflow state");
            };
        }

        throw new RuntimeException("Unknown leave workflow");
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

    private boolean roleMatchesStatus(String role, LeaveRequestStatus status) {
        return switch (status) {
            case PENDING_SERVICE -> "SERVICE_MANAGER".equals(role);
            case PENDING_DIVISION -> "DIVISION_MANAGER".equals(role);
            case PENDING_DEPARTMENT -> "DEPARTMENT_MANAGER".equals(role);
            case PENDING_HR -> "HR".equals(role);
            case PENDING_DIRECTOR -> "DIRECTOR".equals(role);
            default -> false;
        };
    }

    private boolean isShortAbsence(LeaveType leaveType) {
        return leaveType.getName() != null
                && leaveType.getName().equalsIgnoreCase("Autorisation d'absence");
    }

    private boolean isExceptional(LeaveType leaveType) {
        return leaveType.isRequiresDirectorApproval();
    }

    private boolean isStandardLeave(LeaveType leaveType) {
        return !isShortAbsence(leaveType) && !isExceptional(leaveType);
    }
}