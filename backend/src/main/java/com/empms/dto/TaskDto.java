package com.empms.dto;

import com.empms.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        private LocalDate dueDate;

        @NotNull(message = "Assigned employee ID is required")
        private Long assignedToId;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotNull(message = "Status is required")
        private Task.TaskStatus status;
    }

    @Data
    public static class TaskResponse {
        private Long id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private String status;
        private UserInfo assignedTo;
        private LocalDateTime createdAt;

        @Data
        public static class UserInfo {
            private Long id;
            private String name;
            private String email;
        }

        public static TaskResponse fromTask(Task task) {
            TaskResponse response = new TaskResponse();
            response.setId(task.getId());
            response.setTitle(task.getTitle());
            response.setDescription(task.getDescription());
            response.setDueDate(task.getDueDate());
            response.setStatus(task.getStatus().name());
            response.setCreatedAt(task.getCreatedAt());

            if (task.getAssignedTo() != null) {
                UserInfo userInfo = new UserInfo();
                userInfo.setId(task.getAssignedTo().getId());
                userInfo.setName(task.getAssignedTo().getName());
                userInfo.setEmail(task.getAssignedTo().getEmail());
                response.setAssignedTo(userInfo);
            }

            return response;
        }
    }
}
