import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import EditUserForm from '../../components/EditUserForm';
import { useAddUserMutation } from '../../services/user.service';
import { navigate, PageProps } from 'gatsby';
import Permission from '../../components/Permission';

const AddUser: React.FC<PageProps> = ({ location }) => {
  const [addUser, result] = useAddUserMutation();

  useEffect(() => {
    if (result.isSuccess) navigate('/users');
  }, [result.isSuccess]);

  const onAddUser = (user: SgehUser) => {
    addUser(user);
  };
  return (
    <Permission authKeyList={['SUPER_ADMIN']}>
      <Layout isLoading={false}>
        <AdminPageLayout title="Add New User">
          <EditUserForm isEdit={false} value={{}} onSubmit={onAddUser} isUpdating={result.isLoading} isError={result.isError} />
        </AdminPageLayout>
      </Layout>
    </Permission>
  );
};

export default AddUser;
