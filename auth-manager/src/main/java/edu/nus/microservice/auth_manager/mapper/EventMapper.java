package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EventMapper {

    public EventListResponse convertToEventListResponse(EventEntity event, UUID userId){
        List<EventRegistrationEntity> registrationList = event.getRegistration();
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
                .isRegistered(registrationList.contains(userId))
                .registrationCount(registrationList.stream().count())
                .build();
    }

    public EventEntity convertToEventEntity(EventRequest request, UserInfoEntity owner){
        return EventEntity.builder()
                .id(UUID.randomUUID())
                .title(request.getTitle())
                .owner(owner)
                .description(request.getDescription())
                .location(request.getLocation())
                .startDatetime(LocalDateTime.parse(request.getStartDatetime()))
                .endDatetime(LocalDateTime.parse(request.getEndDatetime()))
                .capacity(request.getCapacity())
                .cover(request.getCover())
                .createDatetime(LocalDateTime.now())
                .build();
    }
}