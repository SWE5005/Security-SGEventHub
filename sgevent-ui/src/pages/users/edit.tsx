import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import EditUserForm from '../../components/EditUserForm';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../services/user.service';
import { navigate, PageProps } from 'gatsby';
import Permission from '../../components/Permission';

const EditUser: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');

  if (userId === null) {
    throw new Error('User ID is null');
  }

  const { data, error, isLoading } = useGetUserDetailsQuery(userId);
  const [updateUser, result] = useUpdateUserMutation();

  useEffect(() => {
    if (result.isSuccess) navigate('/users');
  }, [result.isSuccess]);

  const onUpdateUser = (user: SgehUser) => {
    updateUser(user);
  };

  return (
    <Permission authKeyList={['SUPER_ADMIN']}>
      <Layout isLoading={isLoading}>
        <AdminPageLayout title="Edit User">
          <EditUserForm isEdit value={data} onSubmit={onUpdateUser} isUpdating={result.isLoading} isError={result.isError} />
        </AdminPageLayout>
      </Layout>
    </Permission>
  );
};

export default EditUser;
