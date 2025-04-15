package edu.nus.microservice.auth_manager.entity;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoEntity {
	@Id
	@GeneratedValue(strategy= GenerationType.UUID)
	@Column(name = "id", nullable = false)
	private UUID id;

	@NotNull
	@Column(name = "name", nullable = false)
	private String username;

	@NotNull
	@Column(name = "password", nullable = false)
	private String password;

	@NotNull
	@Column(name = "emailAddress", nullable = false)
	private String emailAddress;

	@NotNull
	@Column(name = "activeStatus", nullable = false)
	private String activeStatus;

	@NotNull
	@Column(name = "mobileNumber", nullable = false)
	private String mobileNumber;

	@NotNull
	@Column(name = "roles", nullable = false)
	private String roles;

	@NotNull
	@Column(name = "create_datetime", nullable = false)
	private LocalDateTime createDatetime;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<RefreshTokenEntity> refreshTokens;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<EventEntity> managedEvents;
}
