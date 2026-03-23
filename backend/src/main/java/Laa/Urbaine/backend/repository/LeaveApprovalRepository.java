package Laa.Urbaine.backend.repository;

import Laa.Urbaine.backend.entity.LeaveApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveApprovalRepository extends JpaRepository<LeaveApproval, Long> {
    List<LeaveApproval> findByLeaveRequestIdOrderByLevelOrderAsc(Long leaveRequestId);
}