package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.User;
import org.example.tokentrackerbackend.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity < ? > signupUser(@RequestBody Map < String, String > request) {
        String username = request.get("username");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "Username already exists"));
        }

        User newUser = new User(username);
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "User created", "username", username));
    }

    @PostMapping("/login")
    public ResponseEntity << ? > loginUser(@RequestBody Map < String, String > request) {
        String username = request.get("username");
        Optional < User > user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "username", username));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
    }
}