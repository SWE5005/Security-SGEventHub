import * as React from "react";
import { navigate } from "gatsby";

const IndexPage = () => {
	React.useEffect(() => {
		navigate("/login");
	}, []);
};

export default IndexPage;
