package edu.nus.microservice.auth_manager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class EventEntity {
  @Id
  @Column(name = "id")
  private UUID id;

  @Column(name = "title")
  private String title;

  @Column(name = "description")
  private String description;

  @Column(name = "create_datetime")
  private LocalDateTime createDatetime;

  @Column(name = "start_datetime")
  private LocalDateTime startDatetime;

  @Column(name = "end_datetime")
  private LocalDateTime endDatetime;

  @Column(name = "location")
  private String location;

  @Column(name = "capacity")
  private int capacity;

  @ManyToOne
  @JoinColumn(name = "owner_id", referencedColumnName = "id")
  private UserInfoEntity owner;

  @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<EventRegistrationEntity> registration;

  @Column(name = "status")
  private String status;

  @Column(name = "cover", length = 16777215)
  private String cover;
}
