package com.example.teccon.collectionPhase;

import com.example.teccon.client.Client;
import com.example.teccon.construction.Construction;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "collections",
        indexes = @Index(name = "idx_collection_status", columnList = "status"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Collection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String status;

    // 🔥 AGORA RELACIONAL
    @ManyToOne(optional = false)
    @JoinColumn(name = "construction_id",
            foreignKey = @ForeignKey(name = "fk_collection_construction"))
    private Construction construction;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id",
            foreignKey = @ForeignKey(name = "fk_collection_client"))
    private Client client;

    private LocalDateTime moldingDate;

    private Double fckStrength;

    @Column(length = 50)
    private String concreteType;

    @Column(length = 150)
    private String concreteSupplier;

    private Boolean hasAdditive;

    @Column(length = 100)
    private String additiveType;

    @Column(length = 50)
    private String castingMethod;

    private Double totalVolume;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "collection", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Sample> samples;
}