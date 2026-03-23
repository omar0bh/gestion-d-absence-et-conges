package Laa.Urbaine.backend.dto.leavebalance;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalanceRequest {

    @NotNull(message = "Employee id is required")
    private Long employeeId;

    @NotNull(message = "Leave type id is required")
    private Long leaveTypeId;

    @NotNull(message = "Year is required")
    @Min(value = 2020, message = "Year must be valid")
    private Integer year;

    @NotNull(message = "Remaining days is required")
    @Min(value = 0, message = "Remaining days cannot be negative")
    private Integer remainingDays;
}