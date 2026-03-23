package Laa.Urbaine.backend.dto.leavetype;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveTypeRequest {

    @NotBlank(message = "Leave type name is required")
    private String name;

    private String description;

    @NotNull(message = "Max days is required")
    @Min(value = 1, message = "Max days must be at least 1")
    private Integer maxDays;

    private Boolean requiresProof;

    private Boolean requiresDirectorApproval;
}