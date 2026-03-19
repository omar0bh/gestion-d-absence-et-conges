package Laa.Urbaine.backend.service.auth;

import Laa.Urbaine.backend.dto.auth.AuthResponse;
import Laa.Urbaine.backend.dto.auth.LoginRequest;
import Laa.Urbaine.backend.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}