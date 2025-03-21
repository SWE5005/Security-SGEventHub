package edu.nus.microservice.user_manager.repository;

import edu.nus.microservice.user_manager.model.RolePermission;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;


public interface PermissionRepository extends CrudRepository<RolePermission, UUID> {

    @Query(value = "SELECT role_permission.* FROM role_permission where permission_id=?1",nativeQuery = true)
    RolePermission SearchPermission(int PermissionId);

}

