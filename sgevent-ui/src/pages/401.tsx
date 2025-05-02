import * as React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { Container, Box, Typography, Button } from '@mui/material';

interface ErrorPageProps {
  title: string;
  message: string;
  statusCode?: string;
}

const ErrorPageLayout: React.FC<ErrorPageProps> = ({
  title,
  message,
  statusCode,
}) => {
  const primaryColor = '#1A76D2';

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
        textAlign="center"
        py={5}
      >

        <img src="/sgeh-access-denied.png" width="400px" alt="access denied mascot" />

        {statusCode && (
          <Typography
            variant="h1"
            component="h1"
            fontWeight="bold"
            color="grey.500"
            mb={1}
          >
            {statusCode}
          </Typography>
        )}

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          fontWeight="medium"
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
        >
          {message}
        </Typography>

        <Button
          component={GatsbyLink}
          to="/"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: primaryColor,
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};


const UnauthorizedPage = () => {
  return (
    <ErrorPageLayout
      statusCode="401"
      title="Unauthorized Access"
      message="Sorry, you need to be logged in to view this page."
    />
  );
};

export default UnauthorizedPage;

export const Head = () => <title>401 Unauthorized Access</title>;