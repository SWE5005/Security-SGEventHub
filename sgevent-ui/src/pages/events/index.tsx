import React from 'react';
import Button from '@mui/material/Button';
import EventList from '../../components/EventList';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import { navigate } from 'gatsby';
import { usePermission } from '../../components/Permission';
import Permission from '../../components/Permission';
import { type PageProps } from 'gatsby';

const EventPage: React.FC<PageProps> = () => {
  const onAddClick = () => {
    navigate('/events/add');
  };
  const isAdmin = usePermission(['EVENT_MANAGER', 'SUPER_ADMIN']);
  return (
    <Permission authKeyList={['SUPER_ADMIN', 'EVENT_MANAGER', 'END_USER']}>
      <Layout isLoading={false}>
        <AdminPageLayout
          title={isAdmin ? 'Manage Events' : 'Events'}
          rightEl={
            isAdmin ? (
              <Button variant="contained" onClick={onAddClick}>
                Add new event
              </Button>
            ) : null
          }
        >
          <EventList isAdmin={isAdmin} />
        </AdminPageLayout>
      </Layout>
    </Permission>
  );
};

export default EventPage;
