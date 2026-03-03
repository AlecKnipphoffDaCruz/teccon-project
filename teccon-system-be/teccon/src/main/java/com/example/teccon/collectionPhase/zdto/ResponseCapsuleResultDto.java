package com.example.teccon.collectionPhase.zdto;

import java.time.LocalDateTime;

public record ResponseCapsuleResultDto(
        Long id,
        Long sampleId,
        Integer curingAgeDays,
        Double failureLoadKgf,
        Double compressiveStrengthMpa,
        String pressType,
        LocalDateTime testedAt
) {}