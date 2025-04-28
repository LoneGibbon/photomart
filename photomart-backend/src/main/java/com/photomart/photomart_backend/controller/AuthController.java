package com.photomart.photomart_backend.controller;

import com.photomart.photomart_backend.security.JwtUtils;
import com.photomart.photomart_backend.model.User;
import com.photomart.photomart_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * AuthController
 * 
 * Controller responsible for handling authentication-related APIs such as login and registration.
 * Allows frontend requests (CORS enabled for localhost:3000).
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend calls from React app
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils; // Utility to generate JWT tokens

    @Autowired
    private UserService userService; // Service handling user operations (login, register)

    /**
     * API endpoint for logging in a user.
     * 
     * Accepts email and password from the request body, validates the user,
     * and returns a JWT token if authentication is successful.
     *
     * @param body A JSON map containing "email" and "password"
     * @return 200 OK with email, role, and token if successful, or 401 Unauthorized if invalid credentials
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> user = userService.login(email, password);

        if (user.isPresent()) {
            User u = user.get();

            // Generate a JWT token for the authenticated user
            String token = jwtUtils.generateToken(u.getEmail());

            return ResponseEntity.ok(Map.of(
                    "email", u.getEmail(),
                    "role", u.getRole().name(),
                    "token", token
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    /**
     * API endpoint for registering a new user.
     *
     * Accepts email, password, and role from the request body and registers the user if the email is not already taken.
     *
     * @param body A JSON map containing "email", "password", and "role"
     * @return 200 OK with success message if successful, or 409 Conflict if user exists, or 400 Bad Request if input invalid
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String roleStr = body.get("role");

        if (email == null || password == null || roleStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, password, and role are required"));
        }

        if (userService.findByEmail(email).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "User already exists"));
        }

        try {
            // Convert role string to enum (case insensitive)
            User.Role role = User.Role.valueOf(roleStr.toUpperCase());
            User newUser = new User(email, password, role);
            userService.save(newUser);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (IllegalArgumentException e) {
            // If the role value is not valid
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role specified"));
        }
    }
}