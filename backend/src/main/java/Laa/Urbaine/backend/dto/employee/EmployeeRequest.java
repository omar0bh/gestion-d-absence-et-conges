package Laa.Urbaine.backend.dto.employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {

    @NotBlank(message = "Matricule is required")
    private String matricule;

    @NotNull(message = "User id is required")
    private Long userId;

    private Long departmentId;
    private Long divisionId;
    private Long serviceId;
    private Long directManagerId;

    @NotBlank(message = "Position title is required")
    private String positionTitle;

    private LocalDate hireDate;
}