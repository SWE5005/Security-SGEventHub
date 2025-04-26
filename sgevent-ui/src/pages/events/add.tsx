import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import EditEventForm from '../../components/EditEventForm';
import { useSaveEventMutation } from '../../services/event.service';
import { navigate, PageProps } from 'gatsby';

const AddEvent: React.FC<PageProps> = () => {
  const [addEvent, result] = useSaveEventMutation();
  const [user, setUser] = React.useState<SgehEvent>({} as SgehEvent);

  useEffect(() => {
    if (result.isSuccess) navigate('/events');
  }, [result.isSuccess]);

  const onAddEvent = (user: SgehEvent) => {
    setUser(user);
    addEvent(user);
  };

  return (
    <Layout isLoading={false}>
      <AdminPageLayout title="Add New Event">
        <EditEventForm type="add" value={user} onSubmit={onAddEvent} isUpdating={result.isLoading} isError={result.isError} />
      </AdminPageLayout>
    </Layout>
  );
};

export default AddEvent;
