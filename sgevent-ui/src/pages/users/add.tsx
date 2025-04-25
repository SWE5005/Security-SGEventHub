import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminPageLayout from '../../components/AdminPageLayout';
import EditUserForm from '../../components/EditUserForm';
import { useAddUserMutation } from '../../services/user.service';
import { useGetRoleListQuery } from '../../services/role.service';
import { navigate, PageProps } from 'gatsby';

const AddUser: React.FC<PageProps> = ({ location }) => {
  const { data: roleList, isLoading: isRoleLoading } = useGetRoleListQuery();
  const [addUser, result] = useAddUserMutation();

  useEffect(() => {
    if (result.isSuccess) navigate('/users');
  }, [result.isSuccess]);

  const onAddUser = (user: SgehUser) => {
    addUser(user);
  };
  return (
    <Layout isLoading={isRoleLoading}>
      <AdminPageLayout title="Add New User">
        <EditUserForm isEdit={false} value={{}} onSubmit={onAddUser} isUpdating={result.isLoading} isError={result.isError} />
      </AdminPageLayout>
    </Layout>
  );
};

export default AddUser;
