package com.udaya.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Stores the result of a user's coding/MCQ test attempt.
 */
@Entity
@Table(name = "test_results")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Question.Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Question.Difficulty difficulty;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer correctAnswers;

    @Column(nullable = false)
    private Integer score; // percentage

    @Column(nullable = false)
    private Integer timeTaken; // in seconds

    @Column(columnDefinition = "TEXT")
    private String answersJson; // JSON blob of user answers

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime completedAt;
}
