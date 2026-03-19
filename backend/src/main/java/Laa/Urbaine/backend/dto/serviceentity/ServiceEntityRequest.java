package Laa.Urbaine.backend.dto.serviceentity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntityRequest {

    @NotBlank(message = "Service name is required")
    private String name;

    @NotNull(message = "Division id is required")
    private Long divisionId;

    private Long managerUserId;
}