package com.example.teccon.collectionPhase;

import com.example.teccon.client.Client;
import com.example.teccon.client.zout.ClientRepository;
import com.example.teccon.collectionPhase.zdto.CreateCollectionDto;
import com.example.teccon.collectionPhase.zdto.ResponseCapsuleResultDto;
import com.example.teccon.collectionPhase.zdto.ResponseCollectionDto;
import com.example.teccon.collectionPhase.zdto.ResponseSampleDto;
import com.example.teccon.collectionPhase.zout.CollectionRepository;
import com.example.teccon.construction.Construction;
import com.example.teccon.construction.zout.ConstructionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final ClientRepository clientRepository;
    private final ConstructionRepository constructionRepository;

    public ResponseCollectionDto create(CreateCollectionDto dto) {

        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Construction construction = constructionRepository.findById(dto.constructionId())
                .orElseThrow(() -> new RuntimeException("Construction not found"));

        Collection collection = Collection.builder()
                .status(dto.status())
                .construction(construction)
                .client(client)
                .moldingDate(dto.moldingDate())
                .fckStrength(dto.fckStrength())
                .concreteType(dto.concreteType())
                .concreteSupplier(dto.concreteSupplier())
                .hasAdditive(dto.hasAdditive())
                .additiveType(dto.additiveType())
                .castingMethod(dto.castingMethod())
                .totalVolume(dto.totalVolume())
                .notes(dto.notes())
                .build();

        Collection saved = collectionRepository.save(collection);

        return mapToResponse(saved);
    }

    public List<ResponseCollectionDto> findAll() {
        return collectionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ResponseCollectionDto findById(Long id) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));

        return mapToResponse(collection);
    }

    public ResponseCollectionDto update(Long id, CreateCollectionDto dto) {

        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));

        Client client = clientRepository.findById(dto.clientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Construction construction = constructionRepository.getReferenceById(dto.constructionId());

        collection.setStatus(dto.status());
        collection.setConstruction(construction);
        collection.setClient(client);
        collection.setMoldingDate(dto.moldingDate());
        collection.setFckStrength(dto.fckStrength());
        collection.setConcreteType(dto.concreteType());
        collection.setConcreteSupplier(dto.concreteSupplier());
        collection.setHasAdditive(dto.hasAdditive());
        collection.setAdditiveType(dto.additiveType());
        collection.setCastingMethod(dto.castingMethod());
        collection.setTotalVolume(dto.totalVolume());
        collection.setNotes(dto.notes());

        Collection updated = collectionRepository.save(collection);

        return mapToResponse(updated);
    }

    public void delete(Long id) {

        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));

        collectionRepository.delete(collection);
    }

    private ResponseCollectionDto mapToResponse(Collection collection) {

        List<ResponseSampleDto> samples = collection.getSamples() == null
                ? List.of()
                : collection.getSamples().stream().map(sample ->
                new ResponseSampleDto(
                        sample.getId(),
                        collection.getId(),
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
                        sample.getCapsuleResults() == null
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
                                )).toList()
                )
        ).toList();

        return new ResponseCollectionDto(
                collection.getId(),
                collection.getStatus(),
                collection.getConstruction().getId(),
                collection.getConstruction().getName(),
                collection.getClient().getId(),
                collection.getConstruction().getCuringAgesExpected(),
                collection.getMoldingDate(),
                collection.getFckStrength(),
                collection.getConcreteType(),
                collection.getConcreteSupplier(),
                collection.getHasAdditive(),
                collection.getAdditiveType(),
                collection.getCastingMethod(),
                collection.getTotalVolume(),
                collection.getNotes(),
                samples
        );
    }
}