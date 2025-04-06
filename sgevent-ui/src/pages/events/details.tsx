import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";
import EventReview from "../../components/EventReview";
import { useGetEventDetailsQuery } from "../../services/event.service";
import { useGetUserListByIdsMutation } from "../../services/user.service";
import { authSelector } from "../../state/auth/slice";
import EditEventForm from "../../components/EditEventForm"; // 确保正确引入
import { type PageProps } from 'gatsby';

const EventDetailsPage: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventid");
  const { userInfo } = useSelector((state) => authSelector(state));
  const [event, setEvent] = useState(null);

  const { data: eventData, isLoading } = useGetEventDetailsQuery(eventId);
  const [getUserList, userList] = useGetUserListByIdsMutation();

  useEffect(() => {
    if (eventData) {
      setEvent(eventData);
      if (eventData?.userList?.length) {
        const list = eventData?.userList.map((item) => item.userId);
        getUserList(list);
      }
    }
  }, [eventData]);

  return (
    <Layout>
      <div>
        {event ? (
          <>
            <EditEventForm
              value={event}
              userList={userList.data}
              type="view"
              isChipDisabled
            />{" "}
            {/* 使用 EditEventForm 展示事件详情 */}
            <br />
            <br />
            <br />
            <EventReview eventId={eventId} userId={userInfo.userId} />{" "}
            {/* 渲染事件评论 */}
          </>
        ) : (
          <p>Loading event details...</p>
        )}
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
