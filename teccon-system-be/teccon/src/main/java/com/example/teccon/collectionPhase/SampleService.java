package com.example.teccon.collectionPhase;

import com.example.teccon.collectionPhase.zdto.CreateSampleDto;
import com.example.teccon.collectionPhase.zdto.ResponseCapsuleResultDto;
import com.example.teccon.collectionPhase.zdto.ResponseSampleDto;
import com.example.teccon.collectionPhase.zout.CollectionRepository;
import com.example.teccon.collectionPhase.zout.SampleRepository;
import com.example.teccon.testPhase.CapsuleResult;
import com.example.teccon.testPhase.zout.CapsuleResultRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;
    private final CollectionRepository collectionRepository;
    private final CapsuleResultRepository capsuleResultRepository;

    @Transactional
    public List<ResponseSampleDto> create(List<CreateSampleDto> dtos) {

        if (dtos == null || dtos.isEmpty()) {
            throw new RuntimeException("Sample list cannot be empty");
        }

        Collection collection = collectionRepository.findById(dtos.get(0).collectionId())
                .orElseThrow(() -> new RuntimeException("Collection not found: " + dtos.get(0).collectionId()));

        // Dias de cura esperados da obra (ex: [7, 14, 28])
        List<Integer> curingAges = collection.getConstruction().getCuringAgesExpected();
        if (curingAges == null || curingAges.isEmpty()) {
            throw new RuntimeException("Construction has no curingAgesExpected defined");
        }

        // Conta amostras já existentes para calcular o índice correto
        int existingCount = sampleRepository.countByCollectionId(collection.getId());

        List<ResponseSampleDto> responseList = new ArrayList<>();

        for (int i = 0; i < dtos.size(); i++) {
            CreateSampleDto dto = dtos.get(i);

            // Índice global desta amostra dentro da coleta
            int globalIndex = existingCount + i;

            // Se ultrapassar a lista de idades, repete a última
            int curingAgeDays = curingAges.get(Math.min(globalIndex, curingAges.size() - 1));

            Sample sample = Sample.builder()
                    .collection(collection)
                    .serialNumber(dto.serialNumber())
                    .capsuleCount(dto.capsuleCount())
                    .invoiceNumber(dto.invoiceNumber())
                    .sealNumber(dto.sealNumber())
                    .loadTime(dto.loadTime())
                    .moldingTime(dto.moldingTime())
                    .slumpTest(dto.slumpTest())
                    .extraWaterAdded(dto.extraWaterAdded())
                    .volume(dto.volume())
                    .concreteArea(dto.concreteArea())
                    .build();

            Sample saved = sampleRepository.save(sample);

            // Gera capsuleCount capsulas, todas com a mesma curingAgeDays desta amostra
            List<CapsuleResult> capsules = new ArrayList<>();
            for (int c = 0; c < dto.capsuleCount(); c++) {
                capsules.add(CapsuleResult.builder()
                        .sample(saved)
                        .curingAgeDays(curingAgeDays)
                        .build());
            }

            capsuleResultRepository.saveAll(capsules);
            responseList.add(mapToResponse(saved, capsules));
        }

        return responseList;
    }

    public List<ResponseSampleDto> findByCollection(Long collectionId) {
        return sampleRepository.findByCollectionId(collectionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ResponseSampleDto findById(Long id) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sample not found: " + id));
        return mapToResponse(sample);
    }

    public void delete(Long id) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sample not found: " + id));
        sampleRepository.delete(sample);
    }

    // Sobrecarga com cápsulas recém-criadas (evita re-query após o save)
    private ResponseSampleDto mapToResponse(Sample sample, List<CapsuleResult> capsules) {
        List<ResponseCapsuleResultDto> capsuleResults = capsules.stream()
                .map(cr -> new ResponseCapsuleResultDto(
                        cr.getId(),
                        sample.getId(),
                        cr.getCuringAgeDays(),
                        cr.getFailureLoadKgf(),
                        cr.getCompressiveStrengthMpa(),
                        cr.getPressType(),
                        cr.getTestedAt()
                ))
                .toList();

        return new ResponseSampleDto(
                sample.getId(),
                sample.getCollection().getId(),
                sample.getSerialNumber(),
                sample.getCapsuleCount(),
                sample.getInvoiceNumber(),
                sample.getSealNumber(),
                sample.getLoadTime(),
                sample.getMoldingTime(),
                sample.getSlumpTest(),
                sample.getExtraWaterAdded(),
                sample.getVolume(),
                sample.getConcreteArea(),
                capsuleResults
        );
    }

    // Sobrecarga padrão (busca cápsulas do banco via EAGER)
    private ResponseSampleDto mapToResponse(Sample sample) {
        List<ResponseCapsuleResultDto> capsuleResults = sample.getCapsuleResults() == null
                ? List.of()
                : sample.getCapsuleResults().stream()
                .map(cr -> new ResponseCapsuleResultDto(
                        cr.getId(),
                        sample.getId(),
                        cr.getCuringAgeDays(),
                        cr.getFailureLoadKgf(),
                        cr.getCompressiveStrengthMpa(),
                        cr.getPressType(),
                        cr.getTestedAt()
                ))
                .toList();

        return new ResponseSampleDto(
                sample.getId(),
                sample.getCollection().getId(),
                sample.getSerialNumber(),
                sample.getCapsuleCount(),
                sample.getInvoiceNumber(),
                sample.getSealNumber(),
                sample.getLoadTime(),
                sample.getMoldingTime(),
                sample.getSlumpTest(),
                sample.getExtraWaterAdded(),
                sample.getVolume(),
                sample.getConcreteArea(),
                capsuleResults
        );
    }
}