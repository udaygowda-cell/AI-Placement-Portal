package com.udaya.placement.dto.response;

import lombok.*;

/**
 * JWT authentication response returned on successful login.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
}
