package com.example.teccon.construction.zdto;

import lombok.Builder;

import java.util.List;

@Builder
public record ConstructionRequestDTO(Long clientId,
                                     LocationDTO location,
                                     String name,
                                     List<Integer> curingAgesExpected,
                                     Integer quantityExpected,
                                     String obs
) {
}
