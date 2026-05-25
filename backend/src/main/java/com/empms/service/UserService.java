package com.empms.service;

import com.empms.dto.UserDto;
import com.empms.entity.User;
import com.empms.exception.ResourceNotFoundException;
import com.empms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromUser)
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllEmployees() {
        return userRepository.findByRole(User.Role.EMPLOYEE).stream()
                .map(UserDto::fromUser)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return UserDto.fromUser(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDto.fromUser(user);
    }
}
