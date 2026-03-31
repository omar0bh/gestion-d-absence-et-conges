package Laa.Urbaine.backend.config;

import Laa.Urbaine.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Public auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // ===== READ ACCESS (GET) =====
                        .requestMatchers(HttpMethod.GET,
                                "/api/departments/**",
                                "/api/divisions/**",
                                "/api/services/**",
                                "/api/employees/**",
                                "/api/leave-types/**",
                                "/api/leave-balances/**"
                        ).hasAnyRole(
                                "EMPLOYEE",
                                "SERVICE_MANAGER",
                                "DIVISION_MANAGER",
                                "DEPARTMENT_MANAGER",
                                "HR",
                                "DIRECTOR",
                                "SYSTEM_ADMIN"
                        )

                        // Leave requests
                        .requestMatchers("/api/leave-requests/**").authenticated()

                        // Leave approvals
                        .requestMatchers("/api/leave-approvals/**")
                        .hasAnyRole(
                                "SERVICE_MANAGER",
                                "DIVISION_MANAGER",
                                "DEPARTMENT_MANAGER",
                                "HR",
                                "DIRECTOR",
                                "SYSTEM_ADMIN"
                        )

                        // ===== ADMIN WRITE ACCESS =====
                        .requestMatchers(HttpMethod.POST,
                                "/api/users/**",
                                "/api/departments/**",
                                "/api/divisions/**",
                                "/api/services/**",
                                "/api/employees/**",
                                "/api/leave-types/**",
                                "/api/leave-balances/**"
                        ).hasRole("SYSTEM_ADMIN")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/users/**",
                                "/api/departments/**",
                                "/api/divisions/**",
                                "/api/services/**",
                                "/api/employees/**",
                                "/api/leave-types/**",
                                "/api/leave-balances/**"
                        ).hasRole("SYSTEM_ADMIN")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/users/**",
                                "/api/departments/**",
                                "/api/divisions/**",
                                "/api/services/**",
                                "/api/employees/**",
                                "/api/leave-types/**",
                                "/api/leave-balances/**"
                        ).hasRole("SYSTEM_ADMIN")

                        // Users management read
                        .requestMatchers("/api/users/**").hasRole("SYSTEM_ADMIN")

                        // Everything else
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}