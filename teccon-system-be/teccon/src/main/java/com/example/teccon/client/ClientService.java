package com.example.teccon.client;


import com.example.teccon.client.zdto.ClientRequestDTO;
import com.example.teccon.client.zdto.ClientResponseDTO;
import com.example.teccon.client.zout.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientResponseDTO create(ClientRequestDTO dto) {

        Client client = Client.builder()
                .name(dto.name())
                .contact(dto.contact())
                .isActive(dto.isActive())
                .build();

        Client saved = clientRepository.save(client);

        return mapToResponse(saved);
    }

    public List<ClientResponseDTO> findAll() {
        return clientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ClientResponseDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        return mapToResponse(client);
    }

    public ClientResponseDTO update(Long id, ClientRequestDTO dto) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setName(dto.name());
        client.setContact(dto.contact());

        if (dto.isActive() != null) {
            client.setIsActive(dto.isActive());
        }

        Client updated = clientRepository.save(client);

        return mapToResponse(updated);
    }

    public void delete(Long id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        clientRepository.delete(client);
    }

    private ClientResponseDTO mapToResponse(Client client) {
        return ClientResponseDTO.builder()
                .id(client.getId())
                .name(client.getName())
                .contact(client.getContact())
                .isActive(client.getIsActive())
                .build();
    }
}