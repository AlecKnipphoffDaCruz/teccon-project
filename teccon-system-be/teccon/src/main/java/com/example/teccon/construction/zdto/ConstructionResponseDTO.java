package com.example.teccon.construction.zdto;

import lombok.Builder;

import java.util.List;

@Builder
public record ConstructionResponseDTO(Long id,
                                      String name,
                                      Long clientId,
                                      List<Integer> curingAgesExpected,
                                      Integer quantityExpected,
                                      String obs,
                                      LocationDTO locationDto) {
}
