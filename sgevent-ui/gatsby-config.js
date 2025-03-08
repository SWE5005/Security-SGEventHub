const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config({
	path: `.env`,
});

if (!process.env.GATSBY_ONE_MAP_API_URL) {
	console.warn("Missing env var: ONE_MAP_API_URL");
}

if (!process.env.GATSBY_USER_MANAGER_API_URL) {
	console.warn("Missing env var: USER_MANAGER_API_URL");
}

if (!process.env.GATSBY_EVENT_MANAGER_API_URL) {
	console.warn("Missing env var: EVENT_MANAGER_API_URL");
}

// Validate URLS
const userManagerBaseUrl = new URL(process.env.GATSBY_ONE_MAP_API_URL);
const eventManagerBaseUrl = new URL(process.env.GATSBY_EVENT_MANAGER_API_URL);
const oneMapBaseUrl = new URL(process.env.GATSBY_ONE_MAP_API_URL);

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
	developMiddleware: (app) => {
		// 代理到 User 微服务 (8081)
		app.use(
			"/api/user-manager",
			createProxyMiddleware({
				target: userManagerBaseUrl, //user-manager microservices
				pathRewrite: { "^/api/user-manager": "/api/user-manager" }, // 去掉路径前缀
				changeOrigin: true,
			})
		);
		// 代理到 Event 微服务 (8082)
		app.use(
			"/api/event-manager",
			createProxyMiddleware({
				target: eventManagerBaseUrl, //event-manager microservices
				pathRewrite: { "^/api/event-manager": "/api/event-manager" }, // 去掉路径前缀
				changeOrigin: true,
			})
		);
		app.use(
			"/sgMap",
			createProxyMiddleware({
				target: oneMapBaseUrl,
				secure: false,
				changeOrigin: true,
				pathRewrite: {
					"^/sgMap": "",
				},
			})
		);
	},
	siteMetadata: {
		title: `SG Event Hub`,
		siteUrl: `https://www.sgeventhub.com`,
	},
	plugins: [
		"gatsby-plugin-sitemap",
		{
			resolve: `gatsby-plugin-s3`,
			options: {
				bucketName: "sg-event-hub-ui-2",
			},
		},
	],
};
