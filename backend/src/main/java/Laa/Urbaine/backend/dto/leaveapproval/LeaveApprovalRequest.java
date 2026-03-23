package Laa.Urbaine.backend.dto.leaveapproval;

import Laa.Urbaine.backend.enums.ApprovalDecision;
import Laa.Urbaine.backend.enums.ValidationLevel;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveApprovalRequest {

    @NotNull
    private Long leaveRequestId;

    @NotNull
    private Long approverId;

    @NotNull
    private Integer levelOrder;

    @NotNull
    private ValidationLevel levelName;

    @NotNull
    private ApprovalDecision decision;

    private String comment;
}