package com.udaya.placement.repository;

import com.udaya.placement.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryAndDifficultyAndIsActiveTrue(
        Question.Category category, Question.Difficulty difficulty);
    List<Question> findByCategoryAndIsActiveTrue(Question.Category category);
    
    @Query("SELECT q FROM Question q WHERE q.isActive = true ORDER BY RAND() LIMIT :limit")
    List<Question> findRandomQuestions(int limit);
    
    @Query("SELECT q FROM Question q WHERE q.category = :category AND q.difficulty = :difficulty AND q.isActive = true ORDER BY RAND() LIMIT :limit")
    List<Question> findRandomQuestionsByCategoryAndDifficulty(
        Question.Category category, Question.Difficulty difficulty, int limit);
}
