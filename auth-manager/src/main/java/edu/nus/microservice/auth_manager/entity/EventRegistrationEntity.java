package edu.nus.microservice.auth_manager.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "event_registration")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventRegistrationEntity {

  @Id
  @Column(name = "id")
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  public UserInfoEntity user;

  @ManyToOne
  @JoinColumn(name = "event_id", referencedColumnName = "id")
  private EventEntity event;

  @Column(name = "register_datetime")
  private LocalDateTime registerDatetime;
}
