package com.cloudtrip.itineraryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponse {

    private Long id;
    private String airline;
    private String flightNumber;
    private String fromLocation;
    private String toLocation;
    private String departureTime;
    private String arrivalTime;
    private double price;
    private int availableSeats;
}
