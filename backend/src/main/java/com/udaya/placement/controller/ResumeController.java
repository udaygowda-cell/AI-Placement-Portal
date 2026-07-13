package com.udaya.placement.controller;

import com.udaya.placement.dto.response.ApiResponse;
import com.udaya.placement.entity.*;
import com.udaya.placement.repository.*;
import com.udaya.placement.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

/**
 * Resume management controller.
 */
@RestController
@RequestMapping("/resumes")
@RequiredArgsConstructor
@Tag(name = "Resume", description = "Resume upload and ATS analysis")
@SecurityRequirement(name = "bearerAuth")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    @Operation(summary = "Upload a PDF resume")
    public ResponseEntity<ApiResponse<Resume>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
        Resume resume = resumeService.uploadResume(userId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume uploaded and analyzed successfully!", resume));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's resumes")
    public ResponseEntity<ApiResponse<List<Resume>>> getMyResumes(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
        List<Resume> resumes = resumeService.getUserResumes(userId);
        return ResponseEntity.ok(ApiResponse.success("Resumes fetched", resumes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resume by ID")
    public ResponseEntity<ApiResponse<Resume>> getResume(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Resume fetched", resumeService.getResumeById(id)));
    }
}
