package edu.nus.microservice.auth_manager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "event_registration")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventRegistrationEntity {
  @Id
  @GeneratedValue(strategy= GenerationType.UUID)
  @Column(name = "id")
  private UUID id;

  @Column(name = "user_id")
  private UUID userId;

  @ManyToOne
  @JoinColumn(name = "event_id",referencedColumnName = "id")
  private EventEntity event;

  @Column(name = "register_datetime")
  private Date registerDatetime;
}
