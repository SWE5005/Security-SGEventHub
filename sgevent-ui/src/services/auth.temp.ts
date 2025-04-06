import {
	type Configuration,
	authorizationCodeGrant,
	refreshTokenGrant,
	fetchUserInfo,
	type TokenEndpointResponse,
	type TokenEndpointResponseHelpers,
	type IDToken,
	type ResponseBodyError,
} from "openid-client";
import { type CookieSerializeOptions } from "cookie";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { discovery, allowInsecureRequests } from "openid-client";

export const DEFAULT_COOKIE_OPTIONS: CookieSerializeOptions & { path: string } = {
	domain: process.env.GATSBY_DOMAIN,
	path: "/",
	secure: (process.env.GATSBY_ORIGIN ?? "").toLowerCase().startsWith("https://"),
	httpOnly: true,
	sameSite: "lax",
};

export const COOKIES_TYPE_ENUM = {
	ACCESS_TOKEN: `access_token`,
	REFRESH_TOKEN: `refresh_token`,
	CODE_VERIFIER: `code_verifier`,
};

/**
 * Returns cookie options with the specified expiry time.
 *
 * @param {number} expiry - The maximum age of the cookie in seconds.
 * @return {CookieSerializeOptions & { path: string }} Cookie options with the specified expiry time.
 */
export const expiryCookieOpts = (expiry: number = 0): CookieSerializeOptions & { path: string } => {
	return { ...DEFAULT_COOKIE_OPTIONS, maxAge: expiry };
};

// Load environment variables for OIDC
const clientId = process.env.GATSBY_KEYCLOAK_CLIENT_ID || "sgevent-ui";
const issuerUrl = process.env.GATSBY_KEYCLOAK_URL || "http://localhost:8080/realms/sgeventhub";
const redirectUri = process.env.GATSBY_REDIRECT_URI || "http://localhost:8000/api/auth/callback";
const cookieSecret = process.env.GATSBY_COOKIE_SECRET || "sgEvent-Hub-Secret-Key";

const getOpenIdConfig = async () => {
	const openid_config = await discovery(new URL(issuerUrl), clientId ?? "", undefined, undefined, {
		execute: [allowInsecureRequests],
	});

	return openid_config;
};

// Store OIDC client in memory
// Note: allowInsecureRequests has been marked as deprecated but it's not
export const openid_config = await getOpenIdConfig();

export type AuthClaims = IDToken & {};

export type AuthResultSuccess = {
	success: true;
	claims: AuthClaims;
	access_token?: string;
};

export type AuthResultFail = {
	success: false;
};

export type AuthResult = AuthResultSuccess | AuthResultFail;
/**
 * Refresh the tokens by calling the refresh endpoint with the refresh token.
 * @param {Configuration} oidc_config - The OpenID client configuration
 * @param {string} refreshToken - The refresh token to use for refreshing the tokens
 * @returns {Promise<TokenSet | undefined>} - The newly refreshed tokens, or undefined if the refresh failed
 */
async function refresh(
	oidc_config: Configuration,
	refreshToken: string
): Promise<(TokenEndpointResponse & TokenEndpointResponseHelpers) | undefined> {
	console.debug("attempting to refresh tokens...");

	try {
		const tokenSet: TokenEndpointResponse & TokenEndpointResponseHelpers = await refreshTokenGrant(
			oidc_config,
			refreshToken
		);
		return tokenSet;
	} catch (error) {
		console.error(error);
		// If the refresh failed, return undefined
		return undefined;
	}
}

/**
 * Validate the access token by calling the userinfo endpoint with the access token.
 * @param {Configuration} oidc_config - The OpenID client instance
 * @param {string} accessToken - The access token to validate
 * @returns {Promise<boolean>} - Whether the access token is valid
 */
export async function validateAccessToken(oidc_config: Configuration, accessToken: string): Promise<boolean> {
	try {
		const claims = jwtDecode(accessToken);

		if (!claims.sub) {
			throw new Error("no sub in access token");
		}

		// Call the userinfo endpoint with the access token
		await fetchUserInfo(oidc_config, accessToken, claims.sub);

		return true;
	} catch (error) {
		console.error({ error }, "invalid access token detected");
		return false;
	}
}

/**
 * @description
 * Authenticates the user by validating access token and refresh token, and getting a new access token
 * using the refresh token if the access token is invalid. If the user is redirected from the issuer
 * (e.g. Keycloak), it will also handle the callback from the issuer.
 *
 * @param {Configuration} oidc_config - The OpenID Configuration (openid-client configuration)
 * @param {Cookies} cookies - The cookies object
 * @param {Request} request - The request object
 * @param {URL} url - The URL object
 * @param {Function} onAuthenticationSuccess - The callback function to be called if the authentication is successful
 * @param {Function} onAuthenticationFailed - The callback function to be called if the authentication fails
 *
 * @returns {Promise<boolean>} - Whether the authentication is successful or not
 */
export async function authenticate(
	openid_config: Configuration,
	cookies: Cookies,
	request: Request,
	url: URL
): Promise<AuthResult> {
	// Get the access token and refresh token from the cookies
	const accessToken: string | undefined = cookies.get(COOKIES_TYPE_ENUM.ACCESS_TOKEN);
	const refreshToken: string | undefined = cookies.get(COOKIES_TYPE_ENUM.REFRESH_TOKEN);
	const code_verifier: string | undefined = cookies.get(COOKIES_TYPE_ENUM.CODE_VERIFIER);

	if (accessToken && refreshToken) {
		// === User has both access and refresh tokens, validate the them
		const isAccessTokenValid: boolean = await validateAccessToken(openid_config, accessToken);

		if (isAccessTokenValid) {
			// If the access token is valid, call the onAuthenticationSuccess callback
			return onAuthenticationSuccess(cookies, accessToken);
		} else {
			// If the access token is invalid, refresh the tokens and call the onAuthenticationSuccess callback
			return await refreshTokens(openid_config, refreshToken, cookies);
		}
	} else if (refreshToken) {
		// === No access token but have refresh token
		// If the user has a refresh token but no access token, refresh the tokens and call the onAuthenticationSuccess callback
		return await refreshTokens(openid_config, refreshToken, cookies);
	} else if (isUserRedirectedFromIssuer(url, request)) {
		// === If the user is redirected from the issuer, handle the callback

		const originatingUrl = new URL(envPrivate.ORIGIN + url.pathname + url.search);

		try {
			// either new URL(url.href) or new URL(destination)
			const tokenSet: TokenEndpointResponse & TokenEndpointResponseHelpers = await authorizationCodeGrant(
				openid_config,
				originatingUrl,
				{
					pkceCodeVerifier: code_verifier,
				}
			);

			return onAuthenticationSuccess(cookies, tokenSet.access_token, {
				refresh_token: tokenSet.refresh_token!,
				access_token_expires_in: tokenSet.expires_in!,
			});
		} catch (err) {
			console.error({ err }, "error retrieving tokens from issuer");

			if ((err as ResponseBodyError).error === "invalid_grant") {
				console.debug(`Invalid grant.`);
			} else if ((err as ResponseBodyError).error === "unauthorized_client") {
				// Prevent infinite redirect-loop - misconfiguration detected
				throw new Error("Invalid client. Please check that the client_id and client_secret are correct.");
			}

			return onAuthenticationFailed(cookies);
		}
	}

	return onAuthenticationFailed(cookies);
}

async function refreshTokens(
	openid_config: Configuration,
	refresh_token: string,
	cookies: Cookies
): Promise<AuthResult> {
	const newTokenSet: (TokenEndpointResponse & TokenEndpointResponseHelpers) | undefined = await refresh(
		openid_config,
		refresh_token
	);

	if (!newTokenSet) {
		console.debug("Tokens refresh failed");
		return onAuthenticationFailed(cookies);
	} else {
		console.debug("Tokens refreshed successfully");
		return onAuthenticationSuccess(cookies, newTokenSet.access_token, {
			refresh_token: newTokenSet.refresh_token,
			access_token_expires_in: newTokenSet.expires_in!,
		});
	}
}

/**
 * Handles the authentication success by setting the access and refresh tokens
 * in the user's cookies. If refresh_token and expires_in are provided, those
 * cookies will also be updated.
 *
 * @param cookies - SvelteKit cookies interface to set or delete cookies
 * @param access_token - The access token to set in the cookies
 * @param refresh_token - The refresh token to set in the cookies
 * @param expires_in - The number of seconds until the access token expires
 */
export function onAuthenticationSuccess(
	cookies: Cookies,
	access_token: string,
	options?: {
		refresh_token?: string;
		access_token_expires_in?: number;
	}
): AuthResultSuccess {
	// Set cookies
	if (options?.access_token_expires_in) {
		cookies.set(COOKIES_TYPE_ENUM.ACCESS_TOKEN, access_token, expiryCookieOpts(options.access_token_expires_in));
	}

	if (options?.refresh_token) {
		cookies.set(COOKIES_TYPE_ENUM.REFRESH_TOKEN, options.refresh_token, expiryCookieOpts(refreshExpiresIn));
	}

	cookies.delete(COOKIES_TYPE_ENUM.CODE_VERIFIER, expiryCookieOpts());

	return {
		success: true,
		claims: jwtDecode(access_token),
		access_token: access_token,
	};
}

/**
 * Handles the authentication failure by deleting the access, refresh and code verifier
 * tokens from the user's cookies.
 *
 * @param cookies - SvelteKit cookies interface to delete cookies
 */
export function onAuthenticationFailed(cookies: Cookies): AuthResultFail {
	// Delete the access token
	cookies.delete(COOKIES_TYPE_ENUM.ACCESS_TOKEN, expiryCookieOpts());
	// Delete the refresh token
	cookies.delete(COOKIES_TYPE_ENUM.REFRESH_TOKEN, expiryCookieOpts());
	// Delete the code verifier
	cookies.delete(COOKIES_TYPE_ENUM.CODE_VERIFIER, expiryCookieOpts());

	return {
		success: false,
	};
}
