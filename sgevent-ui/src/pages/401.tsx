import * as React from 'react';
import { Link } from 'gatsby';

const pageStyles = {
  color: '#232129',
  padding: '96px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const paragraphStyles = {
  marginBottom: 48,
};

const NoPermissionPage = () => {
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>No Permission</h1>
      <p style={paragraphStyles}>
        Sorry 😔, you don't have access to this page.
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </main>
  );
};

export default NoPermissionPage;

export const Head = () => <title>No Permission</title>;
