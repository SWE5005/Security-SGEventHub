package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.EventDetailResponse;
import edu.nus.microservice.auth_manager.dto.EventDetailUser;
import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.enums.EventStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EventMapper {

    public EventListResponse convertToEventListResponse(EventEntity event, UUID userId){
        List<EventRegistrationEntity> registrationList = event.getRegistration();
        Boolean isRegistered = registrationList.stream().filter(o->o.user.getId().equals(userId)).findFirst().isPresent();

        return EventListResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .owner(event.getOwner().getEmailAddress())
                .description(event.getDescription())
                .location(event.getLocation())
                .startDatetime(event.getStartDatetime())
                .endDatetime(event.getEndDatetime())
                .capacity(event.getCapacity())
                .cover(event.getCover())
                .createDatetime(event.getCreateDatetime())
                .isRegistered(isRegistered)
                .registrationCount(registrationList.stream().count())
                .build();
    }

    public EventEntity convertToEventEntity(EventRequest request, UserInfoEntity owner){
        UUID id = request.getId() == null ? UUID.randomUUID() : UUID.fromString(request.getId());
        return EventEntity.builder()
                .id(id)
                .title(request.getTitle())
                .owner(owner)
                .description(request.getDescription())
                .location(request.getLocation())
                .startDatetime(LocalDateTime.parse(request.getStartDatetime()))
                .endDatetime(LocalDateTime.parse(request.getEndDatetime()))
                .capacity(request.getCapacity())
                .cover(request.getCover())
                .createDatetime(LocalDateTime.now())
                .status(EventStatus.ACTIVE.name())
                .build();
    }

    public EventDetailResponse convertToEventDetails(EventEntity event, UUID userId){
        List<EventRegistrationEntity> registrationList = event.getRegistration();
        List<EventDetailUser> userList = registrationList==null ? new ArrayList<>() : registrationList.stream().map(EventRegistrationMapper::convertToEventDetailUser).toList();
        Boolean isRegistered = !(registrationList==null) && registrationList.stream().filter(o -> o.user.getId().equals(userId)).findFirst().isPresent();
        return EventDetailResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .owner(event.getOwner().getEmailAddress())
                .description(event.getDescription())
                .location(event.getLocation())
                .startDatetime(event.getStartDatetime())
                .endDatetime(event.getEndDatetime())
                .capacity(event.getCapacity())
                .cover(event.getCover())
                .createDatetime(event.getCreateDatetime())
                .isRegistered(isRegistered)
                .status(event.getStatus())
                .registrationCount(registrationList==null ? 0 : registrationList.stream().count())
                .userList(userList)
                .build();
    }
}