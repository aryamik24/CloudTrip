package com.cloudtrip.hotelservice.repository;

import com.cloudtrip.hotelservice.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByLocationIgnoreCase(String location);
}