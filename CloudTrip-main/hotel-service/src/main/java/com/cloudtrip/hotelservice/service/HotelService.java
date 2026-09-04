package com.cloudtrip.hotelservice.service;

import com.cloudtrip.hotelservice.entity.Hotel;
import com.cloudtrip.hotelservice.exception.ResourceNotFoundException;
import com.cloudtrip.hotelservice.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public Hotel updateHotel(Long id, Hotel updatedHotel) {

        Hotel hotel = getHotelById(id);

        hotel.setName(updatedHotel.getName());
        hotel.setLocation(updatedHotel.getLocation());
        hotel.setDescription(updatedHotel.getDescription());
        hotel.setRating(updatedHotel.getRating());
        hotel.setPricePerNight(updatedHotel.getPricePerNight());
        hotel.setAvailableRooms(updatedHotel.getAvailableRooms());

        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id) {
        Hotel hotel = getHotelById(id);
        hotelRepository.delete(hotel);
    }

    public List<Hotel> searchHotels(String location) {
        return hotelRepository.findByLocationIgnoreCase(location);
    }
}