package com.cloudtrip.itineraryservice.repository;

import com.cloudtrip.itineraryservice.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
}