import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import EventReview from '../../components/EventReview';
import { useGetEventDetailsQuery } from '../../services/event.service';
import EditEventForm from '../../components/EditEventForm';
import { selectAuthSlice } from '../../state/auth/slice';
import { useSelector } from 'react-redux';
import Permission from '../../components/Permission';
import { type PageProps } from 'gatsby';

const EventDetailsPage: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const eventId = params.get('eventid');
  const { userInfo } = useSelector(state => selectAuthSlice(state));

  if (eventId === null) {
    throw new Error('Event ID is null');
  }

  const { data: eventData } = useGetEventDetailsQuery(eventId);

  return (
    <Permission authKeyList={['SUPER_ADMIN', 'EVENT_MANAGER', 'END_USER']}>
      <Layout isLoading={false}>
        <div>
          {eventData ? (
            <>
              <EditEventForm value={eventData} type="view" isChipDisabled />
              <br />
              <br />
              <br />
              <EventReview eventId={eventId} userId={userInfo.user_name} />
            </>
          ) : (
            <p>Loading event details...</p>
          )}
        </div>
      </Layout>
    </Permission>
  );
};

export default EventDetailsPage;
