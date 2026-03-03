package com.example.teccon.collectionPhase;

import com.example.teccon.testPhase.CapsuleResult;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "samples",
        indexes = @Index(name = "idx_sample_serial", columnList = "serial_number"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "collection_id",
            foreignKey = @ForeignKey(name = "fk_sample_collection"))
    private Collection collection;

    @Column(length = 100)
    private String serialNumber;

    private Integer capsuleCount;
    private Integer invoiceNumber;
    private Integer sealNumber;

    private LocalDateTime loadTime;
    private LocalDateTime moldingTime;

    private Double slumpTest;
    private Double extraWaterAdded;
    private Double volume;

    @Column(length = 150)
    private String concreteArea;

    @OneToMany(mappedBy = "sample", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CapsuleResult> capsuleResults;
}