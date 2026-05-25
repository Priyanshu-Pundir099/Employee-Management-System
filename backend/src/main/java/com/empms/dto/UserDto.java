package com.empms.dto;

import com.empms.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public static UserDto fromUser(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
