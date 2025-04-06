import React from "react";
import Button from "@mui/material/Button";
import EventList from "../../components/EventList";
import Layout from "../../components/Layout";
import AdminPageLayout from "../../components/AdminPageLayout";
import { navigate } from "gatsby";
import { authSelector } from "../../state/auth/slice";
import { useSelector } from "react-redux";

export default function EventPage() {
  const { userInfo } = useSelector((state) => authSelector(state));
  const onAddClick = () => {
    navigate("/events/add");
  };
  const isAdmin = userInfo.roleId === 2 || userInfo.roleId === 3;
  return (
    <Layout isLoading={false}>
      <AdminPageLayout
        title={isAdmin ? "Manage Events" : "Events"}
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
}
