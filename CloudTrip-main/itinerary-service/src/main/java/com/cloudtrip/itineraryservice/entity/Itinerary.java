package com.cloudtrip.itineraryservice.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "itineraries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive
    private Long userId;

    @Positive
    private Long flightId;

    @Positive
    @Schema(description = "ID of the hotel selected for this itinerary, resolved via hotel-service")
    private Long hotelId;

    @NotBlank
    private String fromLocation;

    @NotBlank
    private String toLocation;

    @NotBlank
    private String startDate;

    @NotBlank
    private String endDate;

    @Positive
    private double budget;

    private Double totalCost;

    private String status;
}
