package com.photomart.photomart_backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItem {
    private Long id; // product id
    private String title;
    private double price;
    private int quantity;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}