import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAuthStatusQuery, useGetUserInfoQuery } from "../../services/auth.service";
import { authSelector } from "../../state/auth/slice";
import { CircularProgress, Box } from "@mui/material";
import { navigate } from "gatsby";

/**
 * A component to check if the user is authenticated and fetch user info
 * Usage: Wrap any protected page/component with this component
 * If publicPage is true, it won't redirect to login, but will still check auth status
 */
const AuthCheck = ({ children, publicPage = false }) => {
  const { isLoggedIn, isLoading } = useSelector(authSelector);
  const { refetch: refetchAuthStatus } = useGetAuthStatusQuery();
  const { refetch: refetchUserInfo } = useGetUserInfoQuery(undefined, { skip: !isLoggedIn });

  useEffect(() => {
    // Check auth status when component mounts
    refetchAuthStatus();
  }, []);

  useEffect(() => {
    // If authenticated, fetch user info
    if (isLoggedIn) {
      refetchUserInfo();
    } else if (!isLoading && !publicPage) {
      // If not authenticated and not loading, redirect to login
      navigate("/login");
    }
  }, [isLoggedIn, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If this is a protected page and user is not logged in, don't render children
  if (!publicPage && !isLoggedIn) {
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default AuthCheck;