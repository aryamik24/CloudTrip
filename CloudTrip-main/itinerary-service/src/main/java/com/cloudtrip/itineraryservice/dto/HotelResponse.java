package com.cloudtrip.itineraryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelResponse {

    private Long id;
    private String name;
    private String location;
    private String description;
    private double rating;
    private double pricePerNight;
    private int availableRooms;
}
