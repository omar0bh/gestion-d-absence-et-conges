package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.entity.LeaveRequest;
import Laa.Urbaine.backend.service.dashboard.DashboardReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardReportController {

    private final DashboardReportService dashboardReportService;

    // ✅ historique département
    @GetMapping("/department-history/{departmentId}")
    public List<LeaveRequest> getDepartmentHistory(@PathVariable Long departmentId) {
        return dashboardReportService.getDepartmentHistory(departmentId);
    }

    // ✅ approved leaves département
    @GetMapping("/department-approved/{departmentId}")
    public List<LeaveRequest> getDepartmentApproved(@PathVariable Long departmentId) {
        return dashboardReportService.getDepartmentApproved(departmentId);
    }

    // ✅ global history
    @GetMapping("/global-history")
    public List<LeaveRequest> getGlobalHistory() {
        return dashboardReportService.getGlobalHistory();
    }

    // ✅ calendar filters
    @GetMapping("/calendar")
    public List<LeaveRequest> getCalendarData(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long leaveTypeId,
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end
    ) {
        return dashboardReportService.getCalendarData(status, leaveTypeId, start, end);
    }
}