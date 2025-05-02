package edu.nus.microservice.auth_manager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserInfoEntity {

	@Id
	@Column(name = "id", updatable = false, nullable = false)
	private UUID id;

	@Column(name = "name", nullable = false)
	private String username;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "emailAddress", nullable = false, unique = true)
	private String emailAddress;

	@Column(name = "activeStatus", nullable = false)
	private String activeStatus;

	@Column(name = "mobileNumber", nullable = false)
	private String mobileNumber;

	@Column(name = "roles", nullable = false)
	private String roles;

	@Column(name = "create_datetime", nullable = false)
	private LocalDateTime createDatetime;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<RefreshTokenEntity> refreshTokens;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<EventEntity> managedEvents;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<EventRegistrationEntity> registration;

}
