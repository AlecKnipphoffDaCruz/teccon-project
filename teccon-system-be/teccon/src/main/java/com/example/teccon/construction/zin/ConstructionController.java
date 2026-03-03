package com.example.teccon.construction.zin;

import com.example.teccon.client.Client;
import com.example.teccon.client.zout.ClientRepository;
import com.example.teccon.construction.Construction;
import com.example.teccon.construction.Location;
import com.example.teccon.construction.zdto.ConstructionRequestDTO;
import com.example.teccon.construction.zdto.ConstructionResponseDTO;
import com.example.teccon.construction.zdto.LocationDTO;
import com.example.teccon.construction.zout.ConstructionRepository;
import com.example.teccon.construction.zout.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/constructions")
@RequiredArgsConstructor
public class ConstructionController {

        private final ConstructionRepository constructionRepository;
        private final LocationRepository locationRepository;
        private final ClientRepository clientRepository;

        @PostMapping
        public ResponseEntity<ConstructionResponseDTO> create(
                @RequestBody ConstructionRequestDTO dto
        ) {

                Client client = clientRepository.findById(dto.clientId())
                        .orElseThrow(() -> new RuntimeException("Client not found"));

                Location location;

                // Se vier ID -> usa existente
                if (dto.location().id() != null) {
                        location = locationRepository.findById(dto.location().id())
                                .orElseThrow(() -> new RuntimeException("Location not found"));
                } else {
                        // Se não vier ID -> cria nova
                        location = Location.builder()
                                .state(dto.location().state())
                                .city(dto.location().city())
                                .neighborhood(dto.location().neighborhood())
                                .street(dto.location().street())
                                .number(dto.location().number())
                                .build();

                        locationRepository.save(location);
                }

                Construction construction = Construction.builder()
                        .client(client)
                        .location(location)
                        .name(dto.name())
                        .curingAgesExpected(dto.curingAgesExpected())
                        .quantityExpected(dto.quantityExpected())
                        .obs(dto.obs())
                        .build();

                constructionRepository.save(construction);

                return ResponseEntity.ok(toDTO(construction));
        }


        @GetMapping
        public ResponseEntity<List<ConstructionResponseDTO>> findAll() {

                List<ConstructionResponseDTO> list = constructionRepository.findAll()
                        .stream()
                        .map(this::toDTO)
                        .toList();

                return ResponseEntity.ok(list);
        }

        @GetMapping("/{id}")
        public ResponseEntity<ConstructionResponseDTO> findById(
                @PathVariable Long id
        ) {
                Construction construction = constructionRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Construction not found"));

                return ResponseEntity.ok(toDTO(construction));
        }


        @PutMapping("/{id}")
        public ResponseEntity<ConstructionResponseDTO> update(
                @PathVariable Long id,
                @RequestBody ConstructionRequestDTO dto
        ) {

                Construction construction = constructionRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Construction not found"));

                construction.setName(dto.name());
                construction.setCuringAgesExpected(dto.curingAgesExpected());
                construction.setQuantityExpected(dto.quantityExpected());
                construction.setObs(dto.obs());

                constructionRepository.save(construction);

                return ResponseEntity.ok(toDTO(construction));
        }


        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(@PathVariable Long id) {

                constructionRepository.deleteById(id);

                return ResponseEntity.noContent().build();
        }

        private ConstructionResponseDTO toDTO(Construction construction) {

                Location location = construction.getLocation();

                return new ConstructionResponseDTO(
                        construction.getId(),
                        construction.getName(),
                        construction.getClient().getId(),
                        construction.getCuringAgesExpected(),
                        construction.getQuantityExpected(),
                        construction.getObs(),
                        new LocationDTO(
                                location.getId(),
                                location.getState(),
                                location.getCity(),
                                location.getNeighborhood(),
                                location.getStreet(),
                                location.getNumber()
                        )
                );
        }
}