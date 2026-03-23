package Laa.Urbaine.backend.entity;

import Laa.Urbaine.backend.enums.ApprovalDecision;
import Laa.Urbaine.backend.enums.ValidationLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leave_approvals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "leave_request_id")
    private LeaveRequest leaveRequest;

    @ManyToOne(optional = false)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(nullable = false)
    private Integer levelOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ValidationLevel levelName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalDecision decision;

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime decidedAt;
}