package edu.nus.microservice.auth_manager.repository;

import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Transactional
public interface EventRegisterRepository
  extends CrudRepository<EventRegistrationEntity, UUID> {

}
