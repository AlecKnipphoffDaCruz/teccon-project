package com.example.teccon.collectionPhase.zout;

import com.example.teccon.collectionPhase.Sample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, Long> {

    List<Sample> findByCollectionId(Long collectionId);

    List<Sample> findBySerialNumber(String serialNumber);

    int countByCollectionId(Long collectionId);
}