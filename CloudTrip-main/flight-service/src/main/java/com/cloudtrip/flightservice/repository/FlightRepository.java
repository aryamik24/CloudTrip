package com.cloudtrip.flightservice.repository;

import com.cloudtrip.flightservice.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findByFromLocationIgnoreCaseAndToLocationIgnoreCase(
            String fromLocation,
            String toLocation
    );
}