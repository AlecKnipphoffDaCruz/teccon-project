package com.example.teccon.testPhase.zdto;

import java.time.LocalDateTime;

public record CreateCapsuleResultDto(
        Long sampleId,
        Integer curingAgeDays,
        Double failureLoadKgf,
        Double compressiveStrengthMpa,
        String pressType,
        LocalDateTime testedAt
) {}

