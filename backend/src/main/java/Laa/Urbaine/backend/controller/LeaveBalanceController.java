package Laa.Urbaine.backend.controller;

import Laa.Urbaine.backend.dto.leavebalance.LeaveBalanceRequest;
import Laa.Urbaine.backend.entity.LeaveBalance;
import Laa.Urbaine.backend.service.leavebalance.LeaveBalanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
@RequiredArgsConstructor
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @PostMapping
    public ResponseEntity<LeaveBalance> createLeaveBalance(@Valid @RequestBody LeaveBalanceRequest request) {
        return ResponseEntity.ok(leaveBalanceService.createLeaveBalance(request));
    }

    @GetMapping
    public ResponseEntity<List<LeaveBalance>> getAllLeaveBalances() {
        return ResponseEntity.ok(leaveBalanceService.getAllLeaveBalances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveBalance> getLeaveBalanceById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveBalanceService.getLeaveBalanceById(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveBalance>> getBalancesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveBalanceService.getBalancesByEmployee(employeeId));
    }
}