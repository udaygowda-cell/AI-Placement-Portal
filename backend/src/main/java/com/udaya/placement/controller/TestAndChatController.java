package com.udaya.placement.controller;

import com.udaya.placement.dto.response.ApiResponse;
import com.udaya.placement.entity.ChatHistory;
import com.udaya.placement.entity.Question;
import com.udaya.placement.entity.TestResult;
import com.udaya.placement.repository.*;
import com.udaya.placement.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Mock Interview Chatbot Controller.
 */
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Mock interview chatbot")
@SecurityRequirement(name = "bearerAuth")
class ChatController {

    private final AiService aiService;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    @PostMapping("/message")
    @Operation(summary = "Send a message to the AI interviewer")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendMessage(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();

        // Fetch chat history for context
        List<ChatHistory> history = chatHistoryRepository
                .findByUserIdAndSessionIdOrderByCreatedAtAsc(userId, request.getSessionId());

        List<Map<String, String>> historyList = history.stream()
                .map(h -> Map.of("role", h.getRole(), "content", h.getMessage()))
                .toList();

        // Get AI response
        String aiResponse = aiService.generateInterviewerResponse(
                request.getCategory(), request.getMessage(), historyList);

        // Save both messages
        User user = userRepository.findById(userId).orElseThrow();
        chatHistoryRepository.save(ChatHistory.builder()
                .user(user).sessionId(request.getSessionId())
                .role("user").message(request.getMessage()).build());
        chatHistoryRepository.save(ChatHistory.builder()
                .user(user).sessionId(request.getSessionId())
                .role("assistant").message(aiResponse).build());

        return ResponseEntity.ok(ApiResponse.success("Message sent",
                Map.of("response", aiResponse, "sessionId", request.getSessionId())));
    }

    @GetMapping("/history/{sessionId}")
    @Operation(summary = "Get chat history for a session")
    public ResponseEntity<ApiResponse<List<ChatHistory>>> getChatHistory(
            @PathVariable String sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
        List<ChatHistory> history = chatHistoryRepository
                .findByUserIdAndSessionIdOrderByCreatedAtAsc(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success("Chat history fetched", history));
    }
}

@Data
class ChatRequest {
    private String sessionId;
    private String category;
    private String message;
}

/**
 * Coding Test Controller.
 */
@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
@Tag(name = "Tests", description = "MCQ coding test system")
@SecurityRequirement(name = "bearerAuth")
class TestController {

    private final QuestionRepository questionRepository;
    private final TestResultRepository testResultRepository;
    private final UserRepository userRepository;

    @GetMapping("/questions")
    @Operation(summary = "Get MCQ questions for a test")
    public ResponseEntity<ApiResponse<List<Question>>> getTestQuestions(
            @RequestParam String category,
            @RequestParam(defaultValue = "MEDIUM") String difficulty,
            @RequestParam(defaultValue = "10") int count) {

        List<Question> questions = questionRepository.findRandomQuestionsByCategoryAndDifficulty(
                Question.Category.valueOf(category.toUpperCase()),
                Question.Difficulty.valueOf(difficulty.toUpperCase()),
                count);
        return ResponseEntity.ok(ApiResponse.success("Questions fetched", questions));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit test answers and get results")
    public ResponseEntity<ApiResponse<TestResult>> submitTest(
            @RequestBody TestSubmitRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
        User user = userRepository.findById(userId).orElseThrow();

        int score = (int) ((request.getCorrectAnswers() * 100.0) / request.getTotalQuestions());

        TestResult result = TestResult.builder()
                .user(user)
                .category(Question.Category.valueOf(request.getCategory().toUpperCase()))
                .difficulty(Question.Difficulty.valueOf(request.getDifficulty().toUpperCase()))
                .totalQuestions(request.getTotalQuestions())
                .correctAnswers(request.getCorrectAnswers())
                .score(score)
                .timeTaken(request.getTimeTaken())
                .answersJson(request.getAnswersJson())
                .build();

        testResultRepository.save(result);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Test submitted! Score: " + score + "%", result));
    }

    @GetMapping("/my-results")
    @Operation(summary = "Get current user's test results")
    public ResponseEntity<ApiResponse<List<TestResult>>> getMyResults(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
        List<TestResult> results = testResultRepository.findByUserIdOrderByCompletedAtDesc(userId);
        return ResponseEntity.ok(ApiResponse.success("Results fetched", results));
    }
}

@Data
class TestSubmitRequest {
    private String category;
    private String difficulty;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer timeTaken;
    private String answersJson;
}

// Need to import User for ChatController
class User extends com.udaya.placement.entity.User {}
