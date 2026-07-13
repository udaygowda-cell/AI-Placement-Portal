package com.udaya.placement.controller;

import com.udaya.placement.dto.request.LoginRequest;
import com.udaya.placement.dto.request.RegisterRequest;
import com.udaya.placement.dto.response.ApiResponse;
import com.udaya.placement.dto.response.JwtAuthResponse;
import com.udaya.placement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller handling user registration and login.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        JwtAuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful! Welcome to AI Placement Portal.", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with username/email and password")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        JwtAuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", response));
    }
}
