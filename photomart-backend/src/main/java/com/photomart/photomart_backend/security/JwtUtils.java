package com.photomart.photomart_backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JwtUtils
 * 
 * Utility class for generating JSON Web Tokens (JWTs) for authentication.
 */
@Component
public class JwtUtils {

    // Secret key used for signing JWTs
    // Important: Should be at least 256 bits long (32+ characters)
    private final String jwtSecret = "supersecretkeysupersecretkey123456";

    // JWT expiration time: 1 day (in milliseconds)
    private final long jwtExpirationMs = 86400000;

    /**
     * Generates and returns the signing key based on the secret.
     *
     * @return Key used for signing the JWT
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Generates a JWT token based on the provided user's email.
     *
     * @param email The email address to associate with the token (used as subject)
     * @return A signed JWT token string
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email) // Set the user identity (email) in the token
                .setIssuedAt(new Date()) // Timestamp for when the token is created
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // Expiration time
                .signWith(getSigningKey()) // Sign the token with the secret key
                .compact(); // Build and serialize the JWT to a compact URL-safe string
    }
}