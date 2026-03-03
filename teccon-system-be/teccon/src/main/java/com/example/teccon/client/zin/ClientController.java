package com.example.teccon.client.zin;

import com.example.teccon.client.ClientService;
import com.example.teccon.client.zdto.ClientRequestDTO;
import com.example.teccon.client.zdto.ClientResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(
            @RequestBody ClientRequestDTO dto
    ) {
        return ResponseEntity.ok(clientService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> update(
            @PathVariable Long id,
            @RequestBody ClientRequestDTO dto
    ) {
        return ResponseEntity.ok(clientService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}