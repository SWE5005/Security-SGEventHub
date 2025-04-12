package edu.nus.microservice.auth_manager.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserInfoService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
