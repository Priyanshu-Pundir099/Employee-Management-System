package com.empms.repository;

import com.empms.entity.Task;
import com.empms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByStatus(Task.TaskStatus status);
    long countByStatus(Task.TaskStatus status);
}
