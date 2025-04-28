package com.photomart.photomart_backend.repository;

import com.photomart.photomart_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * ProductRepository
 * 
 * Repository interface for managing Product entities.
 * Extends JpaRepository to provide CRUD operations automatically.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Custom query method to find all products belonging to a specific seller.
     * 
     * @param sellerEmail The email address of the seller
     * @return List of products associated with the given seller email
     */
    List<Product> findBySellerEmail(String sellerEmail);
}