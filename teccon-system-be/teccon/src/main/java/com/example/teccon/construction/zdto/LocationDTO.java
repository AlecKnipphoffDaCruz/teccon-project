package com.example.teccon.construction.zdto;

import lombok.Builder;

@Builder
public record LocationDTO(Long id,
                          String state,
                          String city,
                          String neighborhood,
                          String street,
                          Integer number) {
}
