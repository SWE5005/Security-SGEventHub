import path from "path";
// import cookieParser from "cookie-parser";
// import { discovery, allowInsecureRequests } from "openid-client";
import { type CreateWebpackConfigArgs } from "gatsby";

export const onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
	actions.setWebpackConfig({
		resolve: {
			modules: [path.resolve(__dirname, "src"), "node_modules"],
			fallback: {
				fs: false,
				path: false,
				crypto: false,
				os: false,
				https: false,
				http: false,
				zlib: false,
			},
		},
	});
};

// // Create API endpoints for OIDC auth
// export const onCreateDevServer = async ({ app }: CreateDevServerArgs) => {
// 	app.use(cookieParser());

// 	// Load environment variables for OIDC
// 	const clientId = process.env.GATSBY_KEYCLOAK_CLIENT_ID || "sgevent-ui";
// 	const clientSecret = process.env.GATSBY_KEYCLOAK_CLIENT_SECRET || "";
// 	const issuerUrl = process.env.GATSBY_KEYCLOAK_URL || "http://localhost:8080/realms/sgeventhub";
// 	const redirectUri = process.env.GATSBY_REDIRECT_URI || "http://localhost:8000/api/auth/callback";
// 	const cookieSecret = process.env.GATSBY_COOKIE_SECRET || "sgEvent-Hub-Secret-Key";

// 	// Store OIDC client in memory
// 	let oidcClient = await discovery(new URL(issuerUrl), clientId ?? "", undefined, undefined, {});

// 	// Initialize OIDC client
// 	const initOIDC = async () => {
// 		if (oidcClient) return oidcClient;
// 	};

// 	// Helper to set secure cookie
// 	const setAuthCookie = (res, token) => {
// 		const cookieOptions = {
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === "production",
// 			maxAge: 24 * 60 * 60 * 1000, // 24 hours
// 			path: "/",
// 			sameSite: "lax",
// 		};

// 		res.cookie("auth", token, cookieOptions);
// 	};

// 	// Auth status endpoint
// 	app.get("/api/auth/status", async (req, res) => {
// 		try {
// 			const token = req.cookies.auth;

// 			if (!token) {
// 				return res.json({ isAuthenticated: false });
// 			}

// 			const client = await initOIDC();

// 			try {
// 				// Verify the token
// 				const userinfo = await client.userinfo(token);
// 				return res.json({ isAuthenticated: true });
// 			} catch (error) {
// 				// Token is invalid or expired
// 				res.clearCookie("auth");
// 				return res.json({ isAuthenticated: false });
// 			}
// 		} catch (error) {
// 			console.error("Error checking auth status:", error);
// 			return res.status(500).json({ error: "Internal Server Error" });
// 		}
// 	});

// 	// User info endpoint
// 	app.get("/api/auth/userinfo", async (req, res) => {
// 		try {
// 			const token = req.cookies.auth;

// 			if (!token) {
// 				return res.status(401).json({ error: "Not authenticated" });
// 			}

// 			const client = await initOIDC();

// 			try {
// 				// Get user info from the token
// 				const userinfo = await client.userinfo(token);
// 				return res.json(userinfo);
// 			} catch (error) {
// 				// Token is invalid or expired
// 				res.clearCookie("auth");
// 				return res.status(401).json({ error: "Invalid token" });
// 			}
// 		} catch (error) {
// 			console.error("Error fetching user info:", error);
// 			return res.status(500).json({ error: "Internal Server Error" });
// 		}
// 	});

// 	// Login endpoint - redirect to Keycloak
// 	app.get("/api/auth/login", async (req, res) => {
// 		try {
// 			const client = await initOIDC();
// 			const nonce = generators.nonce();
// 			const state = generators.state();

// 			// Store nonce and state in session or cookies
// 			res.cookie("auth_nonce", nonce, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
// 			res.cookie("auth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

// 			const authUrl = client.authorizationUrl({
// 				scope: "openid email profile",
// 				response_mode: "query",
// 				nonce,
// 				state,
// 			});

// 			return res.redirect(authUrl);
// 		} catch (error) {
// 			console.error("Error initiating login:", error);
// 			return res.redirect("/login?error=auth_error");
// 		}
// 	});

// 	// Callback endpoint - handle Keycloak response
// 	app.get("/api/auth/callback", async (req, res) => {
// 		try {
// 			const client = await initOIDC();
// 			const params = client.callbackParams(req);
// 			const nonce = req.cookies.auth_nonce;
// 			const state = req.cookies.auth_state;

// 			// Clear nonce and state cookies
// 			res.clearCookie("auth_nonce");
// 			res.clearCookie("auth_state");

// 			// Validate the callback
// 			const tokenSet = await client.callback(redirectUri, params, { nonce, state });

// 			// Set the access token in an HTTP-only cookie
// 			setAuthCookie(res, tokenSet.access_token);

// 			// Redirect to the home page
// 			return res.redirect("/home");
// 		} catch (error) {
// 			console.error("Error handling callback:", error);
// 			return res.redirect("/login?error=callback_error");
// 		}
// 	});

// 	// Logout endpoint
// 	app.get("/api/auth/logout", async (req, res) => {
// 		try {
// 			const client = await initOIDC();
// 			const token = req.cookies.auth;

// 			// Clear the auth cookie
// 			res.clearCookie("auth");

// 			if (token) {
// 				// Generate Keycloak logout URL
// 				const logoutUrl = client.endSessionUrl({
// 					id_token_hint: token,
// 					post_logout_redirect_uri: process.env.GATSBY_LOGOUT_REDIRECT_URI || "http://localhost:8000/login",
// 				});

// 				return res.redirect(logoutUrl);
// 			} else {
// 				return res.redirect("/login");
// 			}
// 		} catch (error) {
// 			console.error("Error logging out:", error);
// 			return res.redirect("/login");
// 		}
// 	});
// };
