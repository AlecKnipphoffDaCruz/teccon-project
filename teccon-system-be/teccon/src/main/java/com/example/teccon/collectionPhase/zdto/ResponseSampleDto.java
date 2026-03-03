package com.example.teccon.collectionPhase.zdto;

import java.time.LocalDateTime;
import java.util.List;

public record ResponseSampleDto(
        Long id,
        Long collectionId,
        String serialNumber,
        Integer capsuleCount,
        Integer invoiceNumber,
        Integer sealNumber,
        LocalDateTime loadTime,
        LocalDateTime moldingTime,
        Double slumpTest,
        Double extraWaterAdded,
        Double volume,
        String concreteArea,
        List<ResponseCapsuleResultDto> capsulesResults
) {}