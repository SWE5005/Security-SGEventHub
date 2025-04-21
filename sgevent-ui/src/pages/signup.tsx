import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useSignUpMutation } from '../services/auth.service';
import Layout from '../components/Layout';

export default function SignUpPage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setEmailAddress] = useState('');
  const [userPassword, setPassword] = useState('');
  const [userMobileNo, setMobile] = useState('');
  const [signUp, result] = useSignUpMutation();

  const handleSignUp = () => {
    signUp({ userName, userEmail, userPassword, userMobileNo, userRole: 'END_USER' });
  };

  useEffect(() => {
    if (result.isSuccess) {
      navigate('/login');
    } else if (result.isError) {
      console.error('Signup error:', result.error);
    }
  }, [result]);

  return (
    <Layout isLoading={false}>
      <Grid container spacing={2} direction="column" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sx={{ mt: 4, width: '75%' }}>
          <Typography variant="h4" textAlign="center">
            Sign Up
          </Typography>
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            required
            fullWidth
            label="User Name"
            variant="outlined"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Email Address"
            variant="outlined"
            type="email"
            value={userEmail}
            onChange={e => setEmailAddress(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            required
            fullWidth
            label="Contact Number"
            variant="outlined"
            type="text"
            value={userMobileNo}
            onChange={e => setMobile(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={8} sx={{ width: '75%', mt: 2 }}>
          <TextField
            required
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={userPassword}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sx={{ width: '75%', mt: 3, mb: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSignUp} disabled={result.isLoading} fullWidth>
            Sign Up and Auto Login
          </Button>
          {result.isError && <Typography color="error">Sign up failed. Please try again.</Typography>}
        </Grid>
      </Grid>
    </Layout>
  );
}
