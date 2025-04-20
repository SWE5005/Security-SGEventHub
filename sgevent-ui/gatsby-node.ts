import path from "path";
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
