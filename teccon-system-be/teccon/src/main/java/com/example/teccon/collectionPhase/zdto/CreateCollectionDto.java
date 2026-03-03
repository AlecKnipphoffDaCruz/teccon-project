package com.example.teccon.collectionPhase.zdto;

import java.time.LocalDateTime;

public record CreateCollectionDto(

        String status,
        Long constructionId,
        Long clientId,
        LocalDateTime moldingDate,
        Double fckStrength,
        String concreteType,
        String concreteSupplier,
        Boolean hasAdditive,
        String additiveType,
        String castingMethod,
        Double totalVolume,
        String notes
) {}