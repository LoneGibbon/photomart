package com.photomart.photomart_backend.controller;

import com.photomart.photomart_backend.model.Order;
import com.photomart.photomart_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @GetMapping
    public List<Order> getOrders(@RequestParam String email) {
        return orderRepository.findByEmail(email);
    }
}