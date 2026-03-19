package Laa.Urbaine.backend.dto.division;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DivisionRequest {

    @NotBlank(message = "Division name is required")
    private String name;

    @NotNull(message = "Department id is required")
    private Long departmentId;

    private Long managerUserId;
}