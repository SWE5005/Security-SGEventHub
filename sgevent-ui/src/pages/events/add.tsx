import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import AdminPageLayout from "../../components/AdminPageLayout";
import EditEventForm from "../../components/EditEventForm";
import { useAddEventMutation } from "../../services/event.service";
import { useGetRoleListQuery } from "../../services/role.service";
import { navigate, PageProps } from "gatsby";

const AddEvent: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);

  //   const { data: roleList, isLoading: isRoleLoading } = useGetRoleListQuery();
  const [addEvent, result] = useAddEventMutation();
  const [user, setUser] = React.useState({});

  useEffect(() => {
    if (result.isSuccess) navigate("/events");
  }, [result.isSuccess]);

  const onAddEvent = (user) => {
    setUser(user);
    addEvent(user);
  };
  return (
    <Layout isLoading={false}>
      <AdminPageLayout title="Add New Event">
        <EditEventForm
          type="add"
          value={user}
          onSubmit={onAddEvent}
          isUpdating={result.isLoading}
          isError={result.isError}
        />
      </AdminPageLayout>
    </Layout>
  );
}

export default AddEvent;