package com.example.teccon.collectionPhase.zdto;

import java.time.LocalDateTime;

public record CreateSampleDto(
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
        String concreteArea
) {
}
