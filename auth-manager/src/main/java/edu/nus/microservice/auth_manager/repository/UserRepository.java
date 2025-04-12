package edu.nus.microservice.auth_manager.repository;

import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;


public interface UserRepository extends CrudRepository<UserInfoEntity, UUID> {
    Optional<UserInfoEntity> findByEmailAddress(String email);
}
