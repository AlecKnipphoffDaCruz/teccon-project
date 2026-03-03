package com.example.teccon.user;

import com.example.teccon.client.Client;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(length = 150)
    private String contact;

    @Column(length = 100, nullable = false, unique = true)
    private String login;

    @Column(length = 255, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(
            name = "client_id",
            foreignKey = @ForeignKey(name = "fk_user_client")
    )
    private Client client;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @PrePersist
    public void prePersist() {
        if (isActive == null) {
            isActive = true;
        }
    }
}