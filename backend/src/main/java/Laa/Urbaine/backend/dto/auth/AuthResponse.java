package Laa.Urbaine.backend.dto.auth;

import Laa.Urbaine.backend.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
}