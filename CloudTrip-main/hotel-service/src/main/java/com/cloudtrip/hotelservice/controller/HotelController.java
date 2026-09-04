package com.cloudtrip.hotelservice.controller;

import com.cloudtrip.hotelservice.entity.Hotel;
import com.cloudtrip.hotelservice.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotels")
@Tag(name = "Hotel Management", description = "APIs for creating, searching and managing hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @Operation(summary = "Create a new hotel")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Hotel createHotel(@Valid @RequestBody Hotel hotel) {
        return hotelService.createHotel(hotel);
    }

    @Operation(summary = "Get all hotels")
    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @Operation(summary = "Get a hotel by ID")
    @GetMapping("/{id}")
    public Hotel getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id);
    }

    @Operation(summary = "Update an existing hotel")
    @PutMapping("/{id}")
    public Hotel updateHotel(@PathVariable Long id, @Valid @RequestBody Hotel hotel) {
        return hotelService.updateHotel(id, hotel);
    }

    @Operation(summary = "Delete a hotel by ID")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
    }

    @Operation(summary = "Search hotels by location")
    @GetMapping("/search")
    public List<Hotel> searchHotels(@RequestParam String location) {
        return hotelService.searchHotels(location);
    }
}
