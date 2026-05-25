package com.empms.service;

import com.empms.dto.TaskDto;
import com.empms.entity.Task;
import com.empms.entity.User;
import com.empms.exception.ResourceNotFoundException;
import com.empms.repository.TaskRepository;
import com.empms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskDto.TaskResponse createTask(TaskDto.CreateRequest request) {
        User assignedUser = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToId()));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(Task.TaskStatus.NEW)
                .assignedTo(assignedUser)
                .build();

        Task savedTask = taskRepository.save(task);
        return TaskDto.TaskResponse.fromTask(savedTask);
    }

    public List<TaskDto.TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDto.TaskResponse::fromTask)
                .collect(Collectors.toList());
    }

    public TaskDto.TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return TaskDto.TaskResponse.fromTask(task);
    }

    public List<TaskDto.TaskResponse> getTasksByEmployee(Long userId) {
        return taskRepository.findByAssignedToId(userId).stream()
                .map(TaskDto.TaskResponse::fromTask)
                .collect(Collectors.toList());
    }

    public TaskDto.TaskResponse updateTaskStatus(Long taskId, Task.TaskStatus status, String currentUserEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Employees can only update their own tasks
        if (currentUser.getRole() == User.Role.EMPLOYEE) {
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId())) {
                throw new RuntimeException("You can only update your own tasks");
            }
            // Employees can only ACCEPT, REJECT, or COMPLETE tasks
            if (status == Task.TaskStatus.NEW) {
                throw new RuntimeException("Employees cannot set task status to NEW");
            }
        }

        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        return TaskDto.TaskResponse.fromTask(updatedTask);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
    }

    public Map<String, Long> getTaskStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", taskRepository.count());
        stats.put("new", taskRepository.countByStatus(Task.TaskStatus.NEW));
        stats.put("accepted", taskRepository.countByStatus(Task.TaskStatus.ACCEPTED));
        stats.put("completed", taskRepository.countByStatus(Task.TaskStatus.COMPLETED));
        stats.put("rejected", taskRepository.countByStatus(Task.TaskStatus.REJECTED));
        return stats;
    }
}
