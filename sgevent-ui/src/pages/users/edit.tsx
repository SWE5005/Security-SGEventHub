import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import AdminPageLayout from "../../components/AdminPageLayout";
import EditUserForm from "../../components/EditUserForm";
import {
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} from "../../services/user.service";
import { useGetRoleListQuery } from "../../services/role.service";
import { navigate, PageProps } from "gatsby";

const EditUser: React.FC<PageProps> = ({ location }) => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");

    if (userId === null) {
        throw new Error("User ID is null");
    }

    const { data, error, isLoading } = useGetUserDetailsQuery(userId);
    const { data: roleList, isLoading: isRoleLoading } = useGetRoleListQuery();
    const [updateUser, result] = useUpdateUserMutation();
    console.log(data, roleList);

    useEffect(() => {
        if (result.isSuccess) navigate("/users");
    }, [result.isSuccess]);

    const onUpdateUser = (user) => {
        updateUser(user);
    };

    return (
        <Layout isLoading={isLoading || isRoleLoading}>
            <AdminPageLayout title="Edit User">
                <EditUserForm
                    isEdit
                    value={data}
                    roleList={roleList}
                    onSubmit={onUpdateUser}
                    isUpdating={result.isLoading}
                    isError={result.isError}
                />
            </AdminPageLayout>
        </Layout>
    );
}
