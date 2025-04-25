package edu.nus.microservice.auth_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ManageUserRequest
{
    private String userId;
    private String userName;
    private String emailAddress;
    private String mobileNumber;
    private String activeStatus;
    private String roles;
}
