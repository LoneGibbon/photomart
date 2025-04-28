package com.photomart.photomart_backend.model;

import jakarta.persistence.*;

/**
 * User
 *
 * Entity representing a user in the PhotoMart system.
 * Users can either be Customers or Sellers.
 * Mapped automatically to the "users" table in the database.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the user (auto-generated)

    @Column(unique = true)
    private String email; // Unique email address for login

    private String password; // Hashed password for authentication

    @Enumerated(EnumType.STRING)
    private Role role; // User role: either CUSTOMER or SELLER

    /**
     * Role
     * 
     * Enum representing user roles in the system.
     */
    public enum Role {
        CUSTOMER,
        SELLER
    }

    // Constructors

    public User() {
        // Default constructor for JPA
    }

    public User(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
}