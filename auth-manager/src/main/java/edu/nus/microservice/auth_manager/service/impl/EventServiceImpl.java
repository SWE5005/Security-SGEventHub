package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.EventMapper;
import edu.nus.microservice.auth_manager.repository.EventRepository;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
   @Autowired private final EventRepository eventRepository;
    @Autowired private final UserRepository userRepository;
    private final EventMapper eventMapper;

    public List<EventListResponse> getAllEvents(String userId) {
        List<EventEntity> eventlist = eventRepository.findAll();

        UUID id = UUID.fromString(userId);

        return eventlist.stream()
                .map(event -> eventMapper.convertToEventListResponse(event, id))
                .toList();
    }

    public EventEntity createEvent(EventRequest request, String userId) {
        UUID userid = UUID.fromString(userId);
        Optional<UserInfoEntity> userInfo = userRepository.findById(userid);
        UserInfoEntity user = userInfo.get();
        EventEntity event = eventMapper.convertToEventEntity(request,user);

        return eventRepository.save(event);
    }

}
