package Laa.Urbaine.backend.service.dashboard;

import Laa.Urbaine.backend.entity.LeaveRequest;

import java.time.LocalDate;
import java.util.List;

public interface DashboardReportService {

    List<LeaveRequest> getDepartmentHistory(Long departmentId);

    List<LeaveRequest> getDepartmentApproved(Long departmentId);

    List<LeaveRequest> getGlobalHistory();

    List<LeaveRequest> getCalendarData(String status, Long leaveTypeId, LocalDate start, LocalDate end);
}