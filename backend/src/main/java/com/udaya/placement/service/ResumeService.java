package com.udaya.placement.service;

import com.udaya.placement.entity.Resume;
import com.udaya.placement.entity.User;
import com.udaya.placement.exception.BadRequestException;
import com.udaya.placement.exception.ResourceNotFoundException;
import com.udaya.placement.repository.ResumeRepository;
import com.udaya.placement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

/**
 * Service for resume upload, text extraction, and ATS analysis.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Upload and process a PDF resume.
     * Extracts text and calculates ATS score.
     */
    @Transactional
    public Resume uploadResume(Long userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("Please upload a valid PDF file");
        }
        if (!Objects.requireNonNull(file.getContentType()).equals("application/pdf")) {
            throw new BadRequestException("Only PDF files are allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Save file to disk
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text from PDF
        String extractedText = extractTextFromPdf(filePath.toFile());

        // Calculate ATS score
        int atsScore = calculateAtsScore(extractedText);
        String suggestions = generateAtsSuggestions(extractedText, atsScore);
        String skills = extractSkills(extractedText);

        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .extractedText(extractedText)
                .atsScore(atsScore)
                .atsSuggestions(suggestions)
                .skills(skills)
                .isActive(true)
                .build();

        return resumeRepository.save(resume);
    }

    /**
     * Extract plain text from a PDF file using Apache PDFBox.
     */
    private String extractTextFromPdf(File file) {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            log.error("Failed to extract text from PDF: {}", e.getMessage());
            return "";
        }
    }

    /**
     * Simple rule-based ATS scoring algorithm.
     */
    private int calculateAtsScore(String text) {
        if (text == null || text.isBlank()) return 0;
        String lower = text.toLowerCase();
        int score = 0;

        // Section presence (+10 each)
        String[] sections = {"experience", "education", "skills", "projects", "summary", "objective"};
        for (String s : sections) if (lower.contains(s)) score += 10;

        // Contact info
        if (lower.contains("@")) score += 5;
        if (lower.matches(".*\\d{10}.*")) score += 5;
        if (lower.contains("linkedin")) score += 5;
        if (lower.contains("github")) score += 5;

        // Tech keywords
        String[] techKeywords = {"java", "python", "react", "spring", "sql", "git", "html", "css",
                "javascript", "node", "aws", "docker", "kubernetes", "api", "rest", "agile"};
        for (String kw : techKeywords) if (lower.contains(kw)) score += 2;

        // Action verbs
        String[] verbs = {"developed", "designed", "implemented", "built", "created", "managed",
                "led", "improved", "optimized", "deployed", "collaborated"};
        for (String v : verbs) if (lower.contains(v)) score += 1;

        return Math.min(score, 100);
    }

    private String generateAtsSuggestions(String text, int score) {
        List<String> suggestions = new ArrayList<>();
        String lower = text.toLowerCase();

        if (!lower.contains("summary") && !lower.contains("objective"))
            suggestions.add("Add a professional summary/objective section");
        if (!lower.contains("linkedin"))
            suggestions.add("Include your LinkedIn profile URL");
        if (!lower.contains("github"))
            suggestions.add("Add your GitHub profile link");
        if (!lower.contains("projects"))
            suggestions.add("Include a dedicated 'Projects' section with descriptions");
        if (score < 50)
            suggestions.add("Add more technical skills relevant to the job description");
        if (!lower.contains("achievement") && !lower.contains("award"))
            suggestions.add("Highlight achievements/awards to stand out");
        suggestions.add("Use strong action verbs (developed, implemented, optimized)");
        suggestions.add("Quantify achievements with numbers and percentages");

        return String.join(" | ", suggestions);
    }

    private String extractSkills(String text) {
        String lower = text.toLowerCase();
        List<String> found = new ArrayList<>();
        String[] skills = {"java", "python", "javascript", "react", "angular", "vue", "spring boot",
                "node.js", "sql", "mysql", "mongodb", "postgresql", "aws", "docker", "kubernetes",
                "git", "html", "css", "tailwind", "bootstrap", "rest api", "microservices",
                "hibernate", "jpa", "redis", "kafka", "ci/cd", "jenkins", "linux"};
        for (String s : skills) if (lower.contains(s)) found.add(s.toUpperCase());
        return String.join(", ", found);
    }

    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    public Resume getResumeById(Long resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", resumeId));
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findByIsActiveTrue();
    }
}
