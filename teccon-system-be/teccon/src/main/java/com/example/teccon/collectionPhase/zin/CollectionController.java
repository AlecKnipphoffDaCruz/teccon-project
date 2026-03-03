package com.example.teccon.collectionPhase.zin;

import org.springframework.web.bind.annotation.RestController;

import com.example.teccon.collectionPhase.CollectionService;
import com.example.teccon.collectionPhase.zdto.CreateCollectionDto;
import com.example.teccon.collectionPhase.zdto.ResponseCollectionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    public ResponseEntity<ResponseCollectionDto> create(
            @RequestBody CreateCollectionDto dto
    ) {
        return ResponseEntity.ok(collectionService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<ResponseCollectionDto>> findAll() {
        return ResponseEntity.ok(collectionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseCollectionDto> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(collectionService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseCollectionDto> update(
            @PathVariable Long id,
            @RequestBody CreateCollectionDto dto
    ) {
        return ResponseEntity.ok(collectionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        collectionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}