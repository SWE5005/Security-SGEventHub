import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import EventReview from '../../components/EventReview';
import { useGetEventDetailsQuery } from '../../services/event.service';
import EditEventForm from '../../components/EditEventForm';
import { selectAuthSlice } from '../../state/auth/slice';
import { useSelector } from 'react-redux';
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
  );
};

export default EventDetailsPage;
