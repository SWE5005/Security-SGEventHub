import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useSignUpMutation } from '../services/auth.service';
import Layout from '../components/Layout';

export default function SignUpPage() {
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [signUp, result] = useSignUpMutation();

  const handleSignUp = () => {
    signUp({ userName, emailAddress, password })
  };

  useEffect(() => {
    if (result.isSuccess) {
      navigate('/login');
    } else if (result.isError) {
      console.error('Signup error:', result.error);
      // 可以在这里添加一些用户友好的错误消息显示
    }
  }, [result]);

  return (
    <Layout isLoading={false}>
      <Grid container spacing={2} direction="column" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sx={{ mt: 4, width: '75%' }}>
          <Typography variant="h4" textAlign="center">Sign Up</Typography>
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            fullWidth
            label="User Name"
            variant="outlined"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sx={{ width: '75%', mt: 3, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            disabled={result.isLoading}
            fullWidth
          >
            Sign Up and Auto Login
          </Button>
          {result.isError && <Typography color="error">Sign up failed. Please try again.</Typography>}
        </Grid>
      </Grid>
    </Layout>
  );
}