package Laa.Urbaine.backend.repository;

import Laa.Urbaine.backend.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    boolean existsByEmployeeIdAndLeaveTypeIdAndYear(Long employeeId, Long leaveTypeId, Integer year);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeIdAndYear(Long employeeId, Long leaveTypeId, Integer year);
    List<LeaveBalance> findByEmployeeId(Long employeeId);
}