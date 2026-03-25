package Laa.Urbaine.backend.service;

import Laa.Urbaine.backend.entity.User;
import Laa.Urbaine.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔹 get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔹 get user by id
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}