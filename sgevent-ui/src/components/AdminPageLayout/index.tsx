import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const AdminPageLayout = ({ title, rightEl, children }) => {
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center">
          {rightEl}
        </Box>
      </Box>
      {children}
    </>
  );
};

export default AdminPageLayout;
