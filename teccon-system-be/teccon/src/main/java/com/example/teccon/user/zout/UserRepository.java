package com.example.teccon.user.zout;

import com.example.teccon.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByLogin(String login);

    boolean existsByLogin(String login);
}