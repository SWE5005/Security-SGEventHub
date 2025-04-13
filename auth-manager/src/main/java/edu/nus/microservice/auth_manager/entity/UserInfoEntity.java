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
	@Column(name = "email_address", nullable = false)
	private String emailAddress;

	@NotNull
	@Column(name = "active_status", nullable = false)
	private String activeStatus;

	@NotNull
	@Column(name = "mobile_number", nullable = false)
	private String mobileNumber;

	@NotNull
	@Column(name = "roles", nullable = false)
	private String roles;

	@NotNull
	@Column(name = "create_datetime", nullable = false)
	private LocalDateTime createDateTime;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<RefreshTokenEntity> refreshTokens;

}
