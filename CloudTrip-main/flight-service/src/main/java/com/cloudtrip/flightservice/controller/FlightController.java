package com.cloudtrip.flightservice.controller;

import com.cloudtrip.flightservice.entity.Flight;
import com.cloudtrip.flightservice.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flights")
@Tag(name = "Flight Management", description = "APIs for creating, searching and managing flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @Operation(summary = "Create a new flight")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Flight createFlight(@Valid @RequestBody Flight flight) {
        return flightService.createFlight(flight);
    }

    @Operation(summary = "Get all flights")
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @Operation(summary = "Get a flight by ID")
    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    @Operation(summary = "Update an existing flight")
    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable Long id, @Valid @RequestBody Flight flight) {
        return flightService.updateFlight(id, flight);
    }

    @Operation(summary = "Delete a flight by ID")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
    }

    @Operation(summary = "Search flights by origin and destination")
    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String from,
            @RequestParam String to) {

        return flightService.searchFlights(from, to);
    }
}
