package com.example.teccon.client.zdto;

import lombok.Builder;

@Builder
public record ClientRequestDTO(
        String name,
        String contact,
        Boolean isActive
) {
}