package Laa.Urbaine.backend.service.impl;

import Laa.Urbaine.backend.entity.LeaveRequest;
import Laa.Urbaine.backend.enums.LeaveRequestStatus;
import Laa.Urbaine.backend.repository.LeaveRequestRepository;
import Laa.Urbaine.backend.service.dashboard.DashboardReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardReportServiceImpl implements DashboardReportService {

    private final LeaveRequestRepository leaveRequestRepository;

    @Override
    public List<LeaveRequest> getDepartmentHistory(Long departmentId) {
        return leaveRequestRepository.findAll().stream()
                .filter(lr -> lr.getEmployee().getDepartment() != null &&
                        lr.getEmployee().getDepartment().getId().equals(departmentId))
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequest> getDepartmentApproved(Long departmentId) {
        return leaveRequestRepository.findAll().stream()
                .filter(lr -> lr.getEmployee().getDepartment() != null &&
                        lr.getEmployee().getDepartment().getId().equals(departmentId))
                .filter(lr -> lr.getStatus() == LeaveRequestStatus.APPROVED)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequest> getGlobalHistory() {
        return leaveRequestRepository.findAll();
    }

    @Override
    public List<LeaveRequest> getCalendarData(String status, Long leaveTypeId, LocalDate start, LocalDate end) {

        return leaveRequestRepository.findAll().stream()
                .filter(lr -> status == null || lr.getStatus().name().equals(status))
                .filter(lr -> leaveTypeId == null || lr.getLeaveType().getId().equals(leaveTypeId))
                .filter(lr -> start == null || !lr.getStartDate().isBefore(start))
                .filter(lr -> end == null || !lr.getEndDate().isAfter(end))
                .collect(Collectors.toList());
    }
}