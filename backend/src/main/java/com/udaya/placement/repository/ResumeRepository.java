package com.udaya.placement.repository;

import com.udaya.placement.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserIdOrderByUploadedAtDesc(Long userId);
    List<Resume> findByIsActiveTrue();
    Long countByIsActiveTrue();
}
