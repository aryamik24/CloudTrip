package com.cloudtrip.itineraryservice.service;

import com.cloudtrip.itineraryservice.client.FlightClient;
import com.cloudtrip.itineraryservice.client.HotelClient;
import com.cloudtrip.itineraryservice.client.UserClient;
import com.cloudtrip.itineraryservice.dto.FlightResponse;
import com.cloudtrip.itineraryservice.dto.HotelResponse;
import com.cloudtrip.itineraryservice.entity.Itinerary;
import com.cloudtrip.itineraryservice.exception.ResourceNotFoundException;
import com.cloudtrip.itineraryservice.repository.ItineraryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final FlightClient flightClient;
    private final HotelClient hotelClient;
    private final UserClient userClient;

    public ItineraryService(
            ItineraryRepository itineraryRepository,
            FlightClient flightClient,
            HotelClient hotelClient,
            UserClient userClient) {

        this.itineraryRepository = itineraryRepository;
        this.flightClient = flightClient;
        this.hotelClient = hotelClient;
        this.userClient = userClient;
    }

    public Itinerary createItinerary(Itinerary itinerary) {
        userClient.getUserById(itinerary.getUserId());

        itinerary.setStatus("DRAFT");
        itinerary.setTotalCost(0.0);

        return itineraryRepository.save(itinerary);
    }

    public List<Itinerary> getAllItineraries() {
        return itineraryRepository.findAll();
    }

    public Itinerary getItineraryById(Long id) {
        return itineraryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Itinerary not found with id: " + id));
    }

    public Itinerary updateItinerary(Long id, Itinerary updatedItinerary) {
        Itinerary itinerary = getItineraryById(id);

        itinerary.setUserId(updatedItinerary.getUserId());
        itinerary.setFlightId(updatedItinerary.getFlightId());
        itinerary.setHotelId(updatedItinerary.getHotelId());
        itinerary.setFromLocation(updatedItinerary.getFromLocation());
        itinerary.setToLocation(updatedItinerary.getToLocation());
        itinerary.setStartDate(updatedItinerary.getStartDate());
        itinerary.setEndDate(updatedItinerary.getEndDate());
        itinerary.setBudget(updatedItinerary.getBudget());

        return itineraryRepository.save(itinerary);
    }

    public void deleteItinerary(Long id) {
        Itinerary itinerary = getItineraryById(id);
        itineraryRepository.delete(itinerary);
    }

    public Itinerary generateItinerary(Long id) {
        Itinerary itinerary = getItineraryById(id);

        FlightResponse flight = flightClient.getFlightById(itinerary.getFlightId());
        double totalCost = flight.getPrice();

        if (itinerary.getHotelId() != null) {
            HotelResponse hotel = hotelClient.getHotelById(itinerary.getHotelId());
            long nights = ChronoUnit.DAYS.between(
                    LocalDate.parse(itinerary.getStartDate()),
                    LocalDate.parse(itinerary.getEndDate()));
            nights = Math.max(nights, 1);
            totalCost += hotel.getPricePerNight() * nights;
        }

        itinerary.setTotalCost(totalCost);
        itinerary.setStatus("GENERATED");

        return itineraryRepository.save(itinerary);
    }
}
