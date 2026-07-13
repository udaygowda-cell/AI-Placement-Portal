package com.udaya.placement.repository;

import com.udaya.placement.entity.TestResult;
import com.udaya.placement.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserIdOrderByCompletedAtDesc(Long userId);
    List<TestResult> findByUserIdAndCategory(Long userId, Question.Category category);
    
    @Query("SELECT AVG(t.score) FROM TestResult t WHERE t.user.id = :userId")
    Double findAverageScoreByUserId(Long userId);
    
    @Query("SELECT COUNT(t) FROM TestResult t WHERE t.user.id = :userId")
    Long countByUserId(Long userId);
    
    @Query("SELECT AVG(t.score) FROM TestResult t")
    Double findOverallAverageScore();
}
