import "dotenv/config";

import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
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

export default config;
