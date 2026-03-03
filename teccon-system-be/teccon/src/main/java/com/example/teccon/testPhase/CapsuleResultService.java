package com.example.teccon.testPhase;

import com.example.teccon.collectionPhase.Sample;
import com.example.teccon.collectionPhase.zdto.ResponseCapsuleResultDto;
import com.example.teccon.collectionPhase.zout.SampleRepository;
import com.example.teccon.testPhase.zdto.CreateCapsuleResultDto;
import com.example.teccon.testPhase.zout.CapsuleResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CapsuleResultService {

    private final CapsuleResultRepository capsuleResultRepository;
    private final SampleRepository sampleRepository;

    @Transactional
    public ResponseCapsuleResultDto create(CreateCapsuleResultDto dto) {

        Sample sample = sampleRepository.findById(dto.sampleId())
                .orElseThrow(() -> new RuntimeException("Sample not found"));

        CapsuleResult capsuleResult = CapsuleResult.builder()
                .sample(sample)
                .curingAgeDays(dto.curingAgeDays())
                .failureLoadKgf(dto.failureLoadKgf())
                .compressiveStrengthMpa(dto.compressiveStrengthMpa())
                .pressType(dto.pressType())
                .testedAt(dto.testedAt())
                .build();

        capsuleResultRepository.save(capsuleResult);

        return mapToResponse(capsuleResult);
    }

    @Transactional(readOnly = true)
    public List<ResponseCapsuleResultDto> findAll() {
        return capsuleResultRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResponseCapsuleResultDto findById(Long id) {
        CapsuleResult capsuleResult = capsuleResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CapsuleResult not found"));

        return mapToResponse(capsuleResult);
    }

    private ResponseCapsuleResultDto mapToResponse(CapsuleResult entity) {
        return new ResponseCapsuleResultDto(
                entity.getId(),
                entity.getSample().getId(),
                entity.getCuringAgeDays(),
                entity.getFailureLoadKgf(),
                entity.getCompressiveStrengthMpa(),
                entity.getPressType(),
                entity.getTestedAt()
        );
    }
}