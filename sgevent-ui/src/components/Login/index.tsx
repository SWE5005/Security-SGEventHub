import React, { useEffect } from "react";
import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import { initiateLogin } from "../../services/auth.service";
import { authSelector } from "../../state/auth/slice";
import { useSelector } from "react-redux";
import { navigate } from "gatsby";
import { useGetAuthStatusQuery } from "../../services/auth.service";

export default function Login() {
	const { isLoggedIn, isLoading } = useSelector((state) => authSelector(state));
	const { refetch } = useGetAuthStatusQuery();

	// Redirect to home if already logged in
	useEffect(() => {
		if (isLoggedIn) {
			navigate("/home");
		}
	}, [isLoggedIn]);

	const handleLogin = () => {
		initiateLogin();
	};

	// Show loading spinner while checking auth status
	if (isLoading) {
		return (
			<Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				style={{ minHeight: "45vh" }}
			>
				<CircularProgress />
			</Grid>
		);
	}

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
					Welcome to SG Event Hub
				</Typography>
			</Grid>
			<Grid item xs={12} sx={{ width: "75%", mt: 3, mb: 4 }}>
				<Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
					Login with Keycloak
				</Button>
			</Grid>
			<Grid item xs={12} sx={{ width: "75%", mt: 2 }}>
				<Typography textAlign="center" sx={{ mt: 2 }}>
					By logging in, you'll be redirected to our secure authentication provider.
				</Typography>
			</Grid>
		</Grid>
	);
}
