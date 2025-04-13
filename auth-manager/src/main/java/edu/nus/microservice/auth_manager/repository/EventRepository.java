package edu.nus.microservice.auth_manager.repository;


import edu.nus.microservice.auth_manager.entity.EventEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends CrudRepository<EventEntity, UUID> {

  List<EventEntity> findAll();

}
