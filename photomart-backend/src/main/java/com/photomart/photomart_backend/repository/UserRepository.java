package com.photomart.photomart_backend.repository;

import com.photomart.photomart_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository
 *
 * Repository interface for managing User entities.
 * Extends JpaRepository to provide built-in CRUD operations.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Custom query method to find a user by their email address.
     *
     * @param email The email address of the user
     * @return An Optional containing the User if found, or empty if not found
     */
    Optional<User> findByEmail(String email);
}