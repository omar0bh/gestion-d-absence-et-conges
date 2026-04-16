package Laa.Urbaine.backend.repository;

import Laa.Urbaine.backend.entity.LeaveRequest;
import Laa.Urbaine.backend.enums.LeaveRequestStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
List<LeaveRequest> findByEmployee_Department_Id(Long departmentId);

List<LeaveRequest> findByEmployee_Department_IdAndStatus(Long departmentId, LeaveRequestStatus status);
}