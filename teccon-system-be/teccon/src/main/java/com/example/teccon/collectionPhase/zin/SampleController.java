package com.example.teccon.collectionPhase.zin;

import com.example.teccon.collectionPhase.SampleService;
import com.example.teccon.collectionPhase.zdto.CreateSampleDto;
import com.example.teccon.collectionPhase.zdto.ResponseSampleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/samples")
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;

    @PostMapping
    public ResponseEntity<List<ResponseSampleDto>> create(@RequestBody List<CreateSampleDto> dtos) {
        return ResponseEntity.ok(sampleService.create(dtos));
    }
    @GetMapping("/collection/{collectionId}")
    public ResponseEntity<List<ResponseSampleDto>> findByCollection(@PathVariable Long collectionId) {
        return ResponseEntity.ok(sampleService.findByCollection(collectionId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseSampleDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(sampleService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sampleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}