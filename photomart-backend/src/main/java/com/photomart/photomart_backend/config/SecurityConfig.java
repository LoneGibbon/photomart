package com.photomart.photomart_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * SecurityConfig
 * 
 * Configuration class for setting up Spring Security.
 * 
 * - Disables CSRF protection (suitable for APIs, especially during development)
 * - Allows unrestricted access to all endpoints, including the H2 database console
 * - Disables frame options to allow H2 console to be displayed inside frames
 */
@Configuration
public class SecurityConfig {

    /**
     * Defines the security filter chain for the application.
     *
     * @param http HttpSecurity object to customize security behavior
     * @return The built SecurityFilterChain object
     * @throws Exception if there is an error during configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF (Cross-Site Request Forgery) for easier API testing
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll() // Allow access to H2 database console without authentication
                .anyRequest().permitAll() // Allow all other requests without authentication for now
            )
            .headers(headers -> headers.frameOptions().disable()); // Disable frame options so H2 console can render properly

        return http.build(); // Return the configured security filter chain
    }
}