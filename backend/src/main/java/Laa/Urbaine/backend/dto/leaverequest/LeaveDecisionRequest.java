package Laa.Urbaine.backend.dto.leaverequest;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveDecisionRequest {

    @NotNull(message = "Approver user id is required")
    private Long approverUserId;

    private String comment;
}