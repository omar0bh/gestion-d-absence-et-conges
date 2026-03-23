package Laa.Urbaine.backend.dto.leaverequest;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequestCreateRequest {

    @NotNull(message = "Employee id is required")
    private Long employeeId;

    @NotNull(message = "Leave type id is required")
    private Long leaveTypeId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String reason;
}