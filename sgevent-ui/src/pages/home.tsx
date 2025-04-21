import React from 'react';
import { navigate } from 'gatsby';

import { selectAuthSlice } from '../state/auth/slice';
import { useSelector } from 'react-redux';
import { HOME_MAPPING } from '../constants/index';

export default function Home() {
  const { isLoggedIn, userInfo } = useSelector(state => selectAuthSlice(state));

  React.useEffect(() => {
    if (isLoggedIn && userInfo?.access_token && userInfo?.user_role) {
      const role = userInfo.user_role as keyof typeof HOME_MAPPING;
      const link = HOME_MAPPING?.[role] || '';
      navigate(link);
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, userInfo]);

  return null;
}
