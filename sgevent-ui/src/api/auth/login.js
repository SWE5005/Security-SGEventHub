import { Issuer, generators } from "openid-client";

let oidcClient = null;

// Initialize OIDC client
const initOIDC = async () => {
	if (oidcClient) return oidcClient;

	try {
		const issuer = await Issuer.discover(issuerUrl);
		console.log("Discovered issuer %s %O", issuer.issuer, issuer.metadata);

		oidcClient = new issuer.Client({
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uris: [redirectUri],
			response_types: ["code"],
		});

		return oidcClient;
	} catch (error) {
		console.error("Error initializing OIDC client:", error);
		throw error;
	}
};

export default async function API(req, res) {
	try {
		// const client = await initOIDC();
		const nonce = generators.nonce();
		const state = generators.state();

		// Store nonce and state in session or cookies
		res.cookie("auth_nonce", nonce, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
		res.cookie("auth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

		const authUrl = client.authorizationUrl({
			scope: "openid email profile",
			response_mode: "query",
			nonce,
			state,
		});

		return res.redirect(authUrl);
	} catch (error) {
		console.error("Error initiating login:", error);
		return res.redirect("/login?error=auth_error");
	}
}
