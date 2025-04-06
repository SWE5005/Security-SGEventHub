import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { Button, Grid, Typography, CircularProgress } from '@mui/material';
import { initiateLogin } from '../services/auth.service';
import { useSelector } from 'react-redux';
import { authSelector } from '../state/auth/slice';
import Layout from '../components/Layout';
import { useGetAuthStatusQuery } from '../services/auth.service';

export default function SignUpPage() {
  const { isLoggedIn, isLoading } = useSelector((state) => authSelector(state));
  const { refetch } = useGetAuthStatusQuery();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn]);

  const handleRedirectToKeycloak = () => {
    // With Keycloak, sign-up is handled through the same OIDC flow
    // Users will see registration options in Keycloak
    initiateLogin();
  };

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <Layout isLoading={false}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "45vh" }}
        >
          <CircularProgress />
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout isLoading={false}>
      <Grid container spacing={2} direction="column" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sx={{ mt: 4, width: '75%' }}>
          <Typography variant="h4" textAlign="center">Sign Up for SG Event Hub</Typography>
        </Grid>
        <Grid item xs={12} sx={{ width: '75%', mt: 3, mb: 4 }}>
          <Typography textAlign="center" sx={{ mb: 3 }}>
            Click the button below to register with our secure authentication provider.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedirectToKeycloak}
            fullWidth
          >
            Sign Up with Keycloak
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ width: '75%', mt: 2 }}>
          <Typography textAlign="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Log in
            </span>
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}
