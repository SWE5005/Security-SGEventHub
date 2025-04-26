import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import { useGetEventDetailsQuery, useSaveEventMutation, useRemoveParticipantMutation } from '../../services/event.service';
import { navigate } from 'gatsby';
import EditEventForm from '../../components/EditEventForm';
import Button from '@mui/material/Button';
import { type PageProps } from 'gatsby';

const EditEvent: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const eventId = params.get('eventid');

  if (eventId === null) {
    throw new Error('Event ID is null');
  }

  const { data, error, isFetching, refetch } = useGetEventDetailsQuery(eventId);
  const [updateEvent, result] = useSaveEventMutation();
  const [removeParticipant, removeResult] = useRemoveParticipantMutation();
  const [type, setType] = useState('view');

  useEffect(() => {
    if (result.isSuccess) navigate('/events');
  }, [result.isSuccess]);

  const onUpdateUser = (event: SgehEvent) => {
    updateEvent(event);
  };
  return (
    <Layout isLoading={isFetching}>
      <AdminPageLayout
        title={type === 'view' ? 'Event Details' : 'Edit Event'}
        rightEl={
          <Button
            variant="contained"
            onClick={() => {
              setType(prev => (prev === 'view' ? 'edit' : 'view'));
            }}
          >
            {type === 'view' ? 'Edit Event Info' : 'View Event Details'}
          </Button>
        }
      >
        <EditEventForm
          type={type}
          value={data}
          onSubmit={onUpdateUser}
          onDelete={removeParticipant}
          isDeleting={removeResult.isLoading}
          isUpdating={result.isLoading}
          isError={result.isError}
        />
      </AdminPageLayout>
    </Layout>
  );
};

export default EditEvent;
