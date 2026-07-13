package com.udaya.placement.controller;

import com.udaya.placement.dto.response.ApiResponse;
import com.udaya.placement.entity.*;
import com.udaya.placement.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Dashboard controller returning user stats and analytics.
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "User dashboard analytics")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final UserRepository userRepository;
    private final TestResultRepository testResultRepository;
    private final ResumeRepository resumeRepository;
    private final ChatHistoryRepository chatHistoryRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get current user's dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
        User user = userRepository.findById(userId).orElseThrow();git add .

        Long totalTests = testResultRepository.countByUserId(userId);
        Double avgScore = testResultRepository.findAverageScoreByUserId(userId);
        Long totalResumes = (long) resumeRepository.findByUserIdOrderByUploadedAtDesc(userId).size();
        List<TestResult> recentTests = testResultRepository.findByUserIdOrderByCompletedAtDesc(userId)
                .stream().limit(5).toList();

        Map<String, Object> stats = new HashMap<>();
        stats.put("fullName", user.getFullName());
        stats.put("username", user.getUsername());
        stats.put("email", user.getEmail());
        stats.put("college", user.getCollege());
        stats.put("totalTests", totalTests);
        stats.put("averageScore", avgScore != null ? Math.round(avgScore) : 0);
        stats.put("totalResumes", totalResumes);
        stats.put("recentTests", recentTests);
        stats.put("memberSince", user.getCreatedAt());

        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
    }
}

/**
 * Admin controller for managing users, questions, and viewing analytics.
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin panel - requires ADMIN role")
@SecurityRequirement(name = "bearerAuth")
class AdminController {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TestResultRepository testResultRepository;
    private final ResumeRepository resumeRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get platform-wide statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.countRegularUsers());
        stats.put("totalQuestions", questionRepository.count());
        stats.put("totalTests", testResultRepository.count());
        stats.put("totalResumes", resumeRepository.countByIsActiveTrue());
        stats.put("averagePlatformScore", testResultRepository.findOverallAverageScore());
        return ResponseEntity.ok(ApiResponse.success("Admin stats fetched", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/questions")
    @Operation(summary = "Get all questions")
    public ResponseEntity<ApiResponse<List<Question>>> getAllQuestions() {
        return ResponseEntity.ok(ApiResponse.success("Questions fetched", questionRepository.findAll()));
    }

    @PostMapping("/questions")
    @Operation(summary = "Add a new question")
    public ResponseEntity<ApiResponse<Question>> addQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(ApiResponse.success("Question added", questionRepository.save(question)));
    }

    @PutMapping("/questions/{id}")
    @Operation(summary = "Update a question")
    public ResponseEntity<ApiResponse<Question>> updateQuestion(
            @PathVariable Long id, @RequestBody Question updated) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new com.udaya.placement.exception.ResourceNotFoundException("Question", id));
        q.setQuestionText(updated.getQuestionText());
        q.setOptionA(updated.getOptionA());
        q.setOptionB(updated.getOptionB());
        q.setOptionC(updated.getOptionC());
        q.setOptionD(updated.getOptionD());
        q.setCorrectAnswer(updated.getCorrectAnswer());
        q.setExplanation(updated.getExplanation());
        q.setCategory(updated.getCategory());
        q.setDifficulty(updated.getDifficulty());
        return ResponseEntity.ok(ApiResponse.success("Question updated", questionRepository.save(q)));
    }

    @DeleteMapping("/questions/{id}")
    @Operation(summary = "Delete a question")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Question deleted", null));
    }

    @GetMapping("/resumes")
    @Operation(summary = "View all uploaded resumes")
    public ResponseEntity<ApiResponse<List<Resume>>> getAllResumes() {
        return ResponseEntity.ok(ApiResponse.success("Resumes fetched", resumeRepository.findByIsActiveTrue()));
    }

    @GetMapping("/results")
    @Operation(summary = "View all test results")
    public ResponseEntity<ApiResponse<List<TestResult>>> getAllResults() {
        return ResponseEntity.ok(ApiResponse.success("Results fetched", testResultRepository.findAll()));
    }
}
