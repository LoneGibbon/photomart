package com.photomart.photomart_backend.controller;

import com.photomart.photomart_backend.model.Product;
import com.photomart.photomart_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ProductController
 *
 * Controller responsible for handling all product-related APIs.
 * Provides endpoints for sellers to create products, view their products,
 * delete products, and for customers to view all available products.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests from localhost React app
public class ProductController {

    @Autowired
    private ProductRepository productRepository; // Repository to interact with the Product table

    /**
     * API endpoint to create a new product.
     * 
     * @param product The product details sent in the request body
     * @return The saved Product object after insertion into database
     */
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    /**
     * API endpoint to get all products uploaded by a specific seller.
     *
     * @param body A JSON map containing the seller's "email"
     * @return List of products associated with the given seller
     */
    @PostMapping("/mine")
    public List<Product> getProductsForSeller(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        return productRepository.findBySellerEmail(email);
    }

    /**
     * API endpoint to delete a product by its ID.
     *
     * @param id The ID of the product to be deleted
     */
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    /**
     * API endpoint to fetch all products from all sellers.
     *
     * @return List of all products stored in the database
     */
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}