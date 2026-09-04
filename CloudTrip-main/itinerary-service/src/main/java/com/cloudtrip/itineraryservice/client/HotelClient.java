package com.cloudtrip.itineraryservice.client;

import com.cloudtrip.itineraryservice.dto.HotelResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "hotel-service")
public interface HotelClient {

    @GetMapping("/hotels/{id}")
    HotelResponse getHotelById(@PathVariable Long id);

    @GetMapping("/hotels/search")
    List<HotelResponse> searchHotels(@RequestParam String location);
}
