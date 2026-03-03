package com.example.teccon.collectionPhase.zdto;

import java.time.LocalDateTime;
import java.util.List;

public record ResponseCollectionDto(
        Long id,
        String status,
        Long constructionId,
        String constructionName,
        Long clientId,
        List<Integer> curingAgesExpected,
        LocalDateTime moldingDate,
        Double fckStrength,
        String concreteType,
        String concreteSupplier,
        Boolean hasAdditive,
        String additiveType,
        String castingMethod,
        Double totalVolume,
        String notes,
        List<ResponseSampleDto> listSamples
) {}