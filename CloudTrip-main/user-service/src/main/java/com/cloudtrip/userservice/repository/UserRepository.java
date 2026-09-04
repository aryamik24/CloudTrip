package com.cloudtrip.userservice.repository;

import com.cloudtrip.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}