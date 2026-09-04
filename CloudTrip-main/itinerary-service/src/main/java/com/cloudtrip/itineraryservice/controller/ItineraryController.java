package com.cloudtrip.itineraryservice.controller;

import com.cloudtrip.itineraryservice.entity.Itinerary;
import com.cloudtrip.itineraryservice.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/itineraries")
@Tag(name = "Itinerary Management", description = "APIs for creating itineraries and generating combined trip costs")
public class ItineraryController {

    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @Operation(summary = "Create a new itinerary")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Itinerary createItinerary(@Valid @RequestBody Itinerary itinerary) {
        return itineraryService.createItinerary(itinerary);
    }

    @Operation(summary = "Get all itineraries")
    @GetMapping
    public List<Itinerary> getAllItineraries() {
        return itineraryService.getAllItineraries();
    }

    @Operation(summary = "Get an itinerary by ID")
    @GetMapping("/{id}")
    public Itinerary getItineraryById(@PathVariable Long id) {
        return itineraryService.getItineraryById(id);
    }

    @Operation(summary = "Update an existing itinerary")
    @PutMapping("/{id}")
    public Itinerary updateItinerary(
            @PathVariable Long id,
            @Valid @RequestBody Itinerary itinerary) {

        return itineraryService.updateItinerary(id, itinerary);
    }

    @Operation(summary = "Delete an itinerary by ID")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItinerary(@PathVariable Long id) {
        itineraryService.deleteItinerary(id);
    }

    @Operation(summary = "Generate final itinerary cost by combining flight and hotel data")
    @PostMapping("/{id}/generate")
    public Itinerary generateItinerary(@PathVariable Long id) {
        return itineraryService.generateItinerary(id);
    }
}
