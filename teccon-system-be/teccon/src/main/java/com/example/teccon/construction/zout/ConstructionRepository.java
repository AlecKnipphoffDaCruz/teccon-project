package com.example.teccon.construction.zout;

import com.example.teccon.construction.Construction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstructionRepository extends JpaRepository<Construction, Long> {
}