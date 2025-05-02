import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Button, TextField, Box } from '@mui/material';
import { useLoginMutation } from '../../services/auth.service';
import { selectAuthSlice } from '../../state/auth/slice';
import { useSelector } from 'react-redux';
import { navigate } from 'gatsby';

const authUrl = process.env.GATSBY_BACKEND_API_URL;
const Login = () => {
  const [requestLogin, result] = useLoginMutation();
  const { isLoggedIn } = useSelector(state => selectAuthSlice(state));
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = useCallback(() => {
    requestLogin({ emailAddress, password });
  }, [emailAddress, password]);

  const onLoginWithGoogle = useCallback(() => {
    // Auth backend will redirect to Google
    window.location.href = `${authUrl}/oauth2/authorization/google`;
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn]);

  return isLoggedIn ? null : (
    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center"
      style={{ minHeight: '50vh' }}>
      <Grid item xs={12} md={6} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <img src="/sgeh-logo.png" alt="logo" width="75%" style={{ maxWidth: "400px" }} />
      </Grid>
      <Grid item xs={12} md={6} sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: '75%', maxWidth: "sm" }}>
          <TextField
            required
            fullWidth
            label="Email Address"
            variant="outlined"
            value={emailAddress}
            onChange={e => setEmailAddress(e.target.value)}
            margin="normal"
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: '75%', maxWidth: "sm" }}>
          <TextField
            required
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            margin="normal"
          />
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: '75%', maxWidth: "600px" }}>
          <Button variant="contained" color="primary" onClick={onLogin} fullWidth>
            Login
          </Button>
          {result.isError && (
            <Typography color="error" sx={{ mt: 1 }}>
              Login failed. Please try again.
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: '75%', maxWidth: "600px" }}>
          <Typography textAlign="center">
            OR
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: '75%', maxWidth: "600px" }}>
          <Button variant="contained" color="primary" onClick={onLoginWithGoogle} fullWidth>
            <img src="/google.svg" alt="Google Logo" style={{ width: 20, marginRight: 10 }} />Login with Google
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: '75%', maxWidth: "600px" }}>
          <Typography textAlign="center" sx={{ mt: 2 }}>
            Don't have an SG EventHub account? <a
              href="/signup" style={{ textDecoration: 'underline', cursor: 'pointer' }} >
              Sign Up now
            </a>
          </Typography>
        </Box>
      </Grid>
    </Grid >
  );
};
export default Login;
