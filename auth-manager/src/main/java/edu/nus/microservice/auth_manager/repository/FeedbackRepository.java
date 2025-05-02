package edu.nus.microservice.auth_manager.repository;

import edu.nus.microservice.auth_manager.entity.FeedbackEntity;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends ListCrudRepository<FeedbackEntity, UUID> {

  List<FeedbackEntity> findByEventId(UUID eventId);
}
