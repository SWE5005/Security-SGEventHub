package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.dto.EventDetailResponse;
import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.enums.RegistrationTypes;
import edu.nus.microservice.auth_manager.mapper.EventMapper;
import edu.nus.microservice.auth_manager.mapper.EventRegistrationMapper;
import edu.nus.microservice.auth_manager.repository.EventRegistrationRepository;
import edu.nus.microservice.auth_manager.repository.EventRepository;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.EventService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

  @Autowired
  private final EventRepository eventRepository;

  @Autowired
  private final UserRepository userRepository;

  @Autowired
  private final EventRegistrationRepository eventRegistrationRepo;

  private final EventMapper eventMapper;
  private final EventRegistrationMapper eventRegistrationMapper;

  public List<EventListResponse> getAllEvents(String userId) {
    List<EventEntity> eventlist = eventRepository.findAll();

    UUID id = UUID.fromString(userId);

    return eventlist
      .stream()
      .map(event -> eventMapper.convertToEventListResponse(event, id))
      .toList();
  }

  public EventDetailResponse getEventDetails(String eventId, String userId) {
    UUID id = UUID.fromString(eventId);
    Optional<EventEntity> eventDetail = eventRepository.findById(id);

    UUID usrid = UUID.fromString(userId);

    return eventMapper.convertToEventDetails(eventDetail.get(), usrid);
  }

  public String registerEvent(String eventId, String userId, String type) {
    try {
      UUID evtId = UUID.fromString(eventId);
      UUID usrId = UUID.fromString(userId);
      //check whether user has aldy registered to the current event
      Optional<EventRegistrationEntity> registrationEntity = eventRegistrationRepo.findByUserIdAndEventId(usrId, evtId);
      if (RegistrationTypes.REGISTER.name().equals(type) && registrationEntity.isEmpty()) {
        Optional<EventEntity> event = eventRepository.findById(evtId);
        Optional<UserInfoEntity> user = userRepository.findById(usrId);
        EventRegistrationEntity evtRegistration = eventRegistrationMapper.convertToEventRegistration(
          event.get(),
          user.get()
        );
        eventRegistrationRepo.save(evtRegistration);
        return "User has been registered to the targeted event";
      } else if (RegistrationTypes.UNREGISTER.name().equals(type) && registrationEntity.isPresent()) {
        eventRegistrationRepo.deleteById(registrationEntity.get().getId());
        return "User has been unregistered from the targeted event";
      } else {
        throw new Exception(
          "Failed: user has already registered/unregistered to the current event"
        );
      }
    } catch (Exception e) {
      log.error(
        "[EventService:registerEvent]:Failed to register/unregister user to event",
        e
      );
      throw new HttpClientErrorException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error:" + e
      );
    }
  }

  public EventDetailResponse createEvent(EventRequest request, String userId) {
    UUID userid = UUID.fromString(userId);
    Optional<UserInfoEntity> userInfo = userRepository.findById(userid);
    UserInfoEntity user = userInfo.get();
    EventEntity event = eventMapper.convertToEventEntity(request, user);

    EventEntity result =  eventRepository.save(event);
    return eventMapper.convertToEventDetails(result, userid);
  }

  public String deleteEvent(String eventId) {
    try {
      UUID evtId = UUID.fromString(eventId);
      eventRepository.deleteById(evtId);
      return "Success: Delete Event successfully.";
    }catch (Exception e){
      log.error("[EventService:deleteEvent]:Failed to delete event.", e);
      throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Error:" + e);
    }
  }
}
