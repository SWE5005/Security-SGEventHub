import React from "react";
import { navigate } from "gatsby";

export default function Home() {
  React.useEffect(() => {
    navigate("/events");
  }, []);

  return null;
}
