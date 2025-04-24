package edu.nus.microservice.auth_manager.repository;

import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

public interface EventRegistrationRepository
  extends ListCrudRepository<EventRegistrationEntity, UUID> {
  @Query(
    "SELECT r FROM EventRegistrationEntity r " +
    "WHERE r.user.id = :userId " +
    "AND r.event.id = :eventId"
  )
  Optional<EventRegistrationEntity> findByUserIdAndEventId(
    @Param("userId") UUID userId,
    @Param("eventId") UUID eventId
  );
}
