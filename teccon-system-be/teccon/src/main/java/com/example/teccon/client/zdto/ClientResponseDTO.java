package com.example.teccon.client.zdto;

import lombok.Builder;

@Builder
public record ClientResponseDTO(Long id,
                                String name,
                                String contact,
                                Boolean isActive) {
}
