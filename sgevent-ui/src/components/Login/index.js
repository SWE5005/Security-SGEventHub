import React, { useEffect, useState, useCallback } from "react";
import { Grid, Typography, Button, TextField } from "@mui/material";
import { useLoginMutation } from "../../services/auth.service";
import { authSelector } from "../../state/auth/slice";
import { useSelector } from "react-redux";
import { navigate } from "gatsby";

export default function Login() {
  const [requestLogin, result] = useLoginMutation();
  const { isLoggedIn } = useSelector((state) => authSelector(state));
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(() => {
    navigate("http://localhost:8083/oauth2/authorization/google");
  }, [emailAddress, password]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (result) {
      console.log(result);
    }
  }, [result]);

  return isLoggedIn ? null : (
    <Grid
      container
      spacing={2}
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "45vh" }}
    >
      <Grid item xs={12} sx={{ mt: 4, width: "75%" }}>
        <Typography variant="h4" textAlign="center">
          Welcome to Community Event Center
        </Typography>
      </Grid>
      <Grid item xs={12} md={8} sx={{ width: "75%", mt: 2 }}>
        <TextField
          required
          fullWidth
          label="Email Address"
          variant="outlined"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} md={8} sx={{ width: "75%", mt: 2 }}>
        <TextField
          required
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sx={{ width: "75%", mt: 3, mb: 4 }}>
        <Button variant="contained" color="primary" onClick={onLogin} fullWidth>
          Login with Google
        </Button>
        {result.isError && (
          <Typography color="error" sx={{ mt: 1 }}>
            Login failed. Please try again.
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sx={{ width: "75%", mt: 2 }}>
        <Typography textAlign="center" sx={{ mt: 2 }}>
          Don't have an SG EventHub account?
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up now
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
}
