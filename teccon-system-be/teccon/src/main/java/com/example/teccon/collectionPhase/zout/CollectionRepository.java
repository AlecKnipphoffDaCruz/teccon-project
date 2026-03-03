package com.example.teccon.collectionPhase.zout;

import com.example.teccon.collectionPhase.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Long> {

    List<Collection> findByStatus(String status);

    List<Collection> findByClientId(Long clientId);
}