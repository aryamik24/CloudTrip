package com.cloudtrip.itineraryservice.client;

import com.cloudtrip.itineraryservice.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users/{id}")
    UserResponse getUserById(@PathVariable Long id);
}
