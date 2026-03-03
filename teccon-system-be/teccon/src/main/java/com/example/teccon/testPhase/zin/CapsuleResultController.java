package com.example.teccon.testPhase.zin;

import com.example.teccon.collectionPhase.zdto.ResponseCapsuleResultDto;
import com.example.teccon.testPhase.CapsuleResultService;
import com.example.teccon.testPhase.zdto.CreateCapsuleResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/capsule-results")
@RequiredArgsConstructor
public class CapsuleResultController {

    private final CapsuleResultService capsuleResultService;

    @PostMapping
    public ResponseCapsuleResultDto create(@RequestBody CreateCapsuleResultDto dto) {
        return capsuleResultService.create(dto);
    }

    @GetMapping
    public List<ResponseCapsuleResultDto> findAll() {
        return capsuleResultService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseCapsuleResultDto findById(@PathVariable Long id) {
        return capsuleResultService.findById(id);
    }
}