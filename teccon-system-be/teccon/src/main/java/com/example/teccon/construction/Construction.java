package com.example.teccon.construction;

import com.example.teccon.client.Client;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "constructions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Construction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id",
            foreignKey = @ForeignKey(name = "fk_construction_client"))
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "location_id",
            foreignKey = @ForeignKey(name = "fk_construction_location"))
    private Location location;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "curing_ages_expected")
    private List<Integer> curingAgesExpected;

    private Integer quantityExpected;

    @Column(columnDefinition = "TEXT")
    private String obs;
}