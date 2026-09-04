package com.cloudtrip.itineraryservice.client;

import com.cloudtrip.itineraryservice.dto.FlightResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "flight-service")
public interface FlightClient {

    @GetMapping("/flights/{id}")
    FlightResponse getFlightById(@PathVariable Long id);

    @GetMapping("/flights/search")
    List<FlightResponse> searchFlights(
            @RequestParam String from,
            @RequestParam String to
    );
}