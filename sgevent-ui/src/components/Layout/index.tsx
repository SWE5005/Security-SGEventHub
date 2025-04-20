import * as React from "react";
import Header from "../Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormSkeleton from "../FormSkeleton";

export default function Layout({ children, isLoading }: React.PropsWithChildren<{ isLoading: boolean }>) {

  return (
    <Box>
      <Header />
      <br />
      <Container>{isLoading ? <FormSkeleton /> : children}</Container>
    </Box>
  );
}
