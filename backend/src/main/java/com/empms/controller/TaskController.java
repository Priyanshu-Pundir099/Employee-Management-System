package com.empms.controller;

import com.empms.dto.TaskDto;
import com.empms.entity.Task;
import com.empms.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskDto.TaskResponse> createTask(@Valid @RequestBody TaskDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @GetMapping
    public ResponseEntity<List<TaskDto.TaskResponse>> getAllTasks(
            @RequestParam(required = false) Long employeeId,
            Authentication authentication) {

        String currentUserEmail = authentication.getName();

        // If employee, return only their tasks
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"))) {

            // Find the user ID from email - we'll get it from the service
            // For now, use employeeId param if provided
            if (employeeId != null) {
                return ResponseEntity.ok(taskService.getTasksByEmployee(employeeId));
            }
            // Return all tasks for admin or filtered for employee
        }

        if (employeeId != null) {
            return ResponseEntity.ok(taskService.getTasksByEmployee(employeeId));
        }

        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto.TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskDto.TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody TaskDto.UpdateStatusRequest request,
            Authentication authentication) {
        String currentUserEmail = authentication.getName();
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request.getStatus(), currentUserEmail));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getTaskStats() {
        return ResponseEntity.ok(taskService.getTaskStats());
    }

    @GetMapping("/employee/{userId}")
    public ResponseEntity<List<TaskDto.TaskResponse>> getTasksByEmployee(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getTasksByEmployee(userId));
    }
}
