import React from 'react';
import { navigate } from 'gatsby';
import { useLoginWithGoogleMutation } from '../services/auth.service';

export default function Callback() {
  const [requestLogin, result] = useLoginWithGoogleMutation();
  React.useEffect(() => {
    requestLogin();
  }, []);

  React.useEffect(() => {
    if (result.isSuccess) {
      navigate('/home');
    }
  }, [result]);

  return null;
}
