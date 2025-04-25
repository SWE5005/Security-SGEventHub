import React from 'react';
import Button from '@mui/material/Button';
import EventList from '../../components/EventList';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import { navigate } from 'gatsby';
import { selectAuthSlice } from '../../state/auth/slice';
import { usePermission } from '../../components/Permission';
import { useSelector } from 'react-redux';
import { type PageProps } from 'gatsby';

const EventPage: React.FC<PageProps> = () => {
  const { userInfo } = useSelector(state => selectAuthSlice(state));
  const onAddClick = () => {
    navigate('/events/add');
  };
  const isAdmin = usePermission(['EVENT_MANAGER', 'SUPER_ADMIN']);
  return (
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
  );
};

export default EventPage;
