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

const ForbiddenPage = () => {
  return (
    <ErrorPageLayout
      statusCode="403"
      title="Forbidden"
      message="Sorry you do not have the permissions required to view this page."
    />
  );
};

export default ForbiddenPage;

// Update the Head export for SEO and browser tab title
export const Head = () => <title>403 Forbidden</title>;