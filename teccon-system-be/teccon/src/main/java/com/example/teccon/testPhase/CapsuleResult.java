package com.example.teccon.testPhase;

import com.example.teccon.collectionPhase.Sample;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "capsule_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CapsuleResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sample_id",
            foreignKey = @ForeignKey(name = "fk_capsule_sample"))
    private Sample sample;

    private Integer curingAgeDays;
    private Double failureLoadKgf;
    private Double compressiveStrengthMpa;

    @Column(length = 50)
    private String pressType;

    private LocalDateTime testedAt;
}