import React from 'react';
import { Box } from '@mui/material';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import UserList from '../../components/UserList';
import Button from '@mui/material/Button';
import { navigate } from 'gatsby';
import Permission from '../../components/Permission';

export default function UserPage() {
  const onAddClick = () => {
    navigate('/users/add');
  };
  return (
    <Permission authKeyList={['SUPER_ADMIN']}>
      <Layout isLoading={false}>
        <AdminPageLayout
          title="Manage Users"
          rightEl={
            <Button variant="contained" onClick={onAddClick}>
              Add new user
            </Button>
          }
        >
          <Box sx={{ flexGrow: 1 }}>
            <UserList />
          </Box>
        </AdminPageLayout>
      </Layout>
    </Permission>
  );
}
