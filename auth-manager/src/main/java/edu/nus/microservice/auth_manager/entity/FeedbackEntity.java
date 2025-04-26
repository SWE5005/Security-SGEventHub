package edu.nus.microservice.auth_manager.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "feedback")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class FeedbackEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "id")
  private UUID id;

  @Column(name = "event_id")
  private UUID eventId;

  @Column(name = "rating")
  private int rating;

  @Column(name = "comment")
  private String comment;

  @Column(name = "create_datetime")
  private LocalDateTime createDatetime;

  @ManyToOne
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private UserInfoEntity user;
}
