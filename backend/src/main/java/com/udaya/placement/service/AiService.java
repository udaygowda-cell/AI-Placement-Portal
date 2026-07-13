package com.udaya.placement.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

/**
 * Service for integrating with Google Gemini AI API.
 * Generates interview questions and mock interviewer responses.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    @Value("${app.gemini.api-key}")
    private String geminiApiKey;

    @Value("${app.gemini.api-url}")
    private String geminiApiUrl;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    /**
     * Generate interview questions for a given category and difficulty using Gemini.
     */
    public String generateInterviewQuestions(String category, String difficulty, int count) {
        String prompt = buildQuestionPrompt(category, difficulty, count);
        return callGeminiApi(prompt);
    }

    /**
     * Generate AI interviewer response for mock interview chatbot.
     */
    public String generateInterviewerResponse(String category, String userMessage, List<Map<String, String>> history) {
        String prompt = buildInterviewerPrompt(category, userMessage, history);
        return callGeminiApi(prompt);
    }

    /**
     * Calls the Gemini API with the given prompt and returns the text response.
     */
    private String callGeminiApi(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", List.of(part));
            requestBody.put("contents", List.of(content));

            // Gemini generation config
            Map<String, Object> genConfig = new HashMap<>();
            genConfig.put("temperature", 0.7);
            genConfig.put("maxOutputTokens", 2048);
            requestBody.put("generationConfig", genConfig);

            String response = webClientBuilder.build()
                    .post()
                    .uri(geminiApiUrl + "?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // Parse Gemini response
            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return getFallbackResponse();
        }
    }

    private String buildQuestionPrompt(String category, String difficulty, int count) {
        return String.format("""
            You are a senior technical interviewer. Generate exactly %d %s-level interview questions 
            for the topic: %s.
            
            Format your response as a JSON array:
            [
              {
                "question": "Question text here",
                "answer": "Detailed answer here",
                "tip": "Pro tip for answering this question",
                "difficulty": "%s",
                "category": "%s"
              }
            ]
            
            Make questions practical, real-world focused, and suitable for fresher to 2-year experience level.
            Return ONLY the JSON array, no extra text.
            """, count, difficulty, category, difficulty, category);
    }

    private String buildInterviewerPrompt(String category, String userMessage,
                                           List<Map<String, String>> history) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
            You are a professional technical interviewer conducting a mock interview for a software developer role.
            Your specialization is: """).append(category).append("""
            .
            
            Rules:
            - Ask one question at a time
            - Evaluate the candidate's answer briefly before asking the next question
            - Be encouraging but professional
            - Ask follow-up questions based on answers
            - Keep responses concise (2-4 sentences max)
            - If this is the start, introduce yourself and ask the first question
            
            Conversation history:
            """);

        for (Map<String, String> msg : history) {
            sb.append(msg.get("role")).append(": ").append(msg.get("content")).append("\n");
        }
        sb.append("Candidate: ").append(userMessage).append("\nInterviewer: ");

        return sb.toString();
    }

    private String getFallbackResponse() {
        return "I apologize, I'm having trouble connecting to the AI service right now. " +
               "Please check your Gemini API key in the application configuration and try again.";
    }
}
