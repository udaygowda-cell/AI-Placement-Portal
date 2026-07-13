package com.udaya.placement.controller;

import com.udaya.placement.dto.response.ApiResponse;
import com.udaya.placement.entity.ChatHistory;
import com.udaya.placement.entity.Question;
import com.udaya.placement.repository.ChatHistoryRepository;
import com.udaya.placement.repository.UserRepository;
import com.udaya.placement.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * AI Interview Question Generator Controller.
 */
@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
@Tag(name = "Interview", description = "AI-powered interview question generation")
@SecurityRequirement(name = "bearerAuth")
public class InterviewController {

    private final AiService aiService;

    @GetMapping("/questions")
    @Operation(summary = "Generate interview questions using AI")
    public ResponseEntity<ApiResponse<String>> generateQuestions(
            @RequestParam String category,
            @RequestParam(defaultValue = "MEDIUM") String difficulty,
            @RequestParam(defaultValue = "10") int count) {

        String questions = aiService.generateInterviewQuestions(category, difficulty, Math.min(count, 20));
        return ResponseEntity.ok(ApiResponse.success("Questions generated successfully", questions));
    }
}
