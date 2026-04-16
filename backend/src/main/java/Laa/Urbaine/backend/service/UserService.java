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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User request) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new RuntimeException("Email already exists");
        }

        existing.setFullName(request.getFullName());
        existing.setEmail(request.getEmail());
        existing.setRole(request.getRole());
        existing.setActive(request.isActive());

        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}