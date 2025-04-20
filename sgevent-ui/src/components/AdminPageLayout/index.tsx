import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface AdminPageLayoutProps {
  title: string;
  rightEl?: React.ReactNode;
  children?: React.ReactNode;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ title, rightEl, children }) => {
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
