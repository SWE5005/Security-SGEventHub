package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.model.UserDetailModel;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailId) throws UsernameNotFoundException {
        return userRepository
                .findByEmailAddress(emailId)
                .map(UserDetailModel::new)
                .orElseThrow(()-> new UsernameNotFoundException("UserEmail: "+emailId+" does not exist"));

    }
}
