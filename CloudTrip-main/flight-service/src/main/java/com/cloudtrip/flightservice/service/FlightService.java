package com.cloudtrip.flightservice.service;

import com.cloudtrip.flightservice.entity.Flight;
import com.cloudtrip.flightservice.exception.ResourceNotFoundException;
import com.cloudtrip.flightservice.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
    }

    public Flight updateFlight(Long id, Flight updatedFlight) {

        Flight flight = getFlightById(id);

        flight.setAirline(updatedFlight.getAirline());
        flight.setFlightNumber(updatedFlight.getFlightNumber());
        flight.setFromLocation(updatedFlight.getFromLocation());
        flight.setToLocation(updatedFlight.getToLocation());
        flight.setDepartureTime(updatedFlight.getDepartureTime());
        flight.setArrivalTime(updatedFlight.getArrivalTime());
        flight.setPrice(updatedFlight.getPrice());
        flight.setAvailableSeats(updatedFlight.getAvailableSeats());

        return flightRepository.save(flight);
    }

    public void deleteFlight(Long id) {
        Flight flight = getFlightById(id);
        flightRepository.delete(flight);
    }

    public List<Flight> searchFlights(String from, String to) {
        return flightRepository
                .findByFromLocationIgnoreCaseAndToLocationIgnoreCase(from, to);
    }
}