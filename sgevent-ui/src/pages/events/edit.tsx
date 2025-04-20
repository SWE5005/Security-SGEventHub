import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import AdminPageLayout from "../../components/AdminPageLayout";
import {
  useGetEventDetailsQuery,
  useUpdateEventMutation,
  useRegisterEventMutation,
} from "../../services/event.service";
import { navigate } from "gatsby";
import EditEventForm from "../../components/EditEventForm";
import { useGetUserListByIdsMutation } from "../../services/user.service";
import Button from "@mui/material/Button";
import { type PageProps } from "gatsby";

const EditEvent: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventid");

  if (eventId === null) {
    throw new Error("Event ID is null");
  }

  const { data, error, isFetching, refetch } = useGetEventDetailsQuery(eventId);
  const [updateEvent, result] = useUpdateEventMutation();
  const [registerEvent, registerResult] = useRegisterEventMutation();
  const [getUserList, userListResult] = useGetUserListByIdsMutation();
  const [type, setType] = useState("view");
  const [value, setValue] = useState<SgehEventDetails | undefined>(undefined);
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    if (result.isSuccess) navigate("/events");
  }, [result.isSuccess]);

  useEffect(() => {
    //reset userlist when user click on close button on participants
    if (registerResult.isSuccess) {
      const userId = registerResult?.originalArgs?.userId;
      setUserList((prev) => {
        const userList = [...prev];
        const index = userList.findIndex((user) => user.userId === userId);
        userList.splice(index, 1);
        return userList;
      });
    }
  }, [registerResult]);

  useEffect(() => {
    //get userList data when user detail is available
    if (data) {
      setValue(data as SgehEventDetails);
      if (data.userList?.length) {
        const list = data.userList.map((item) => item.userId);
        getUserList(list);
      }
    }
  }, [data]);

  useEffect(() => {
    setUserList(userListResult.data ?? []);
  }, [userListResult]);

  const onUpdateUser = (event: SgehEvent) => {
    updateEvent(event);
  };
  return (
    <Layout isLoading={isFetching}>
      <AdminPageLayout
        title={type === "view" ? "Event Details" : "Edit Event"}
        rightEl={
          <Button
            variant="contained"
            onClick={() => {
              setType((prev) => (prev === "view" ? "edit" : "view"));
            }}
          >
            {type === "view" ? "Edit Event Info" : "View Event Details"}
          </Button>
        }
      >
        <EditEventForm
          type={type}
          value={value}
          userList={userList}
          onSubmit={onUpdateUser}
          onDelete={registerEvent}
          isDeleting={registerResult.isLoading}
          isUpdating={result.isLoading}
          isError={result.isError}
        />
      </AdminPageLayout>
    </Layout>
  );
}

export default EditEvent;