package com.photomart.photomart_backend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Product
 *
 * Entity representing a product listed for sale on the PhotoMart platform.
 * Mapped to a database table automatically by JPA.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key (auto-generated)

    private String title; // Title of the product (ex: "Sunset Over the Mountains")
    private String description; // Detailed description of the product
    private Double price; // Price of the product (example: 99.99)
    private String category; // Category to which the product belongs (ex: "Nature", "Urban")

    private String image; // URL to the image or base64-encoded image string

    private String sellerEmail; // Email address of the seller who uploaded this product
}