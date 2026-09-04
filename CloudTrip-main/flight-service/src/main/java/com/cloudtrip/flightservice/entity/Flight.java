package com.cloudtrip.flightservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "flights")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String airline;

    @NotBlank
    private String flightNumber;

    @NotBlank
    private String fromLocation;

    @NotBlank
    private String toLocation;

    @NotBlank
    private String departureTime;

    @NotBlank
    private String arrivalTime;

    @Positive
    private double price;

    @Positive
    private int availableSeats;
}