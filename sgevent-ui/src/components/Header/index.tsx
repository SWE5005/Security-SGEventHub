import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { navigate, Link } from 'gatsby';
import { useLogoutMutation } from '../../services/auth.service';
import Button from '@mui/material/Button';
import Permission from '../Permission';

export default function Header() {
  const [requestLogout, result] = useLogoutMutation();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const performLogout = () => {
    requestLogout();
  };

  React.useEffect(() => {
    if (result.isSuccess) {
      navigate('/login');
    }
  }, [result]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="go to home"
            sx={{ mr: 2 }}
            onClick={handleNavigateHome}
          >
            <HomeIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Permission authKeyList={['SUPER_ADMIN']} isRedirectOnFail={false}>
              <Button color="inherit" component={Link} to="/users">
                Users
              </Button>
            </Permission>
            <Permission authKeyList={['SUPER_ADMIN', 'EVENT_MANAGER', 'END_USER']} isRedirectOnFail={false}>
              <Button color="inherit" component={Link} to="/events">
                Events
              </Button>
            </Permission>
          </Box>
          <Button color="inherit" onClick={performLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
