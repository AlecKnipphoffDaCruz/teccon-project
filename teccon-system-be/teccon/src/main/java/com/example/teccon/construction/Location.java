package com.example.teccon.construction;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String neighborhood;

    @Column(length = 150)
    private String street;

    private Integer number;

    @OneToMany(mappedBy = "location")
    private List<Construction> constructions;
}
