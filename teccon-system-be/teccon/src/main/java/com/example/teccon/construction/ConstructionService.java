package com.example.teccon.construction;

import com.example.teccon.client.Client;
import com.example.teccon.client.zout.ClientRepository;
import com.example.teccon.construction.zdto.ConstructionRequestDTO;
import com.example.teccon.construction.zdto.ConstructionResponseDTO;
import com.example.teccon.construction.zdto.LocationDTO;
import com.example.teccon.construction.zout.ConstructionRepository;
import com.example.teccon.construction.zout.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConstructionService {

    private final ConstructionRepository constructionRepository;
    private final LocationRepository locationRepository;
    private final ClientRepository clientRepository;

    public ConstructionResponseDTO create(ConstructionRequestDTO dto) {

        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Location location = locationRepository.findById(dto.location().id())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Construction construction = Construction.builder()
                .client(client)
                .location(location)
                .name(dto.name())
                .curingAgesExpected(dto.curingAgesExpected())
                .quantityExpected(dto.quantityExpected())
                .obs(dto.obs())
                .build();

        constructionRepository.save(construction);

        return mapToResponse(construction);
    }

    public List<ConstructionResponseDTO> findAll() {
        return constructionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ConstructionResponseDTO findById(Long id) {
        Construction construction = constructionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Construction not found"));
        return mapToResponse(construction);
    }

    private ConstructionResponseDTO mapToResponse(Construction construction) {
        return ConstructionResponseDTO.builder()
                .id(construction.getId())
                .clientId(construction.getClient().getId())   // ← adicionado
                .name(construction.getName())
                .curingAgesExpected(construction.getCuringAgesExpected())
                .quantityExpected(construction.getQuantityExpected())
                .obs(construction.getObs())
                .locationDto(
                        LocationDTO.builder()
                                .id(construction.getLocation().getId())
                                .state(construction.getLocation().getState())
                                .city(construction.getLocation().getCity())
                                .neighborhood(construction.getLocation().getNeighborhood())
                                .street(construction.getLocation().getStreet())
                                .number(construction.getLocation().getNumber())
                                .build()
                )
                .build();
    }
}