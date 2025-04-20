import * as React from "react";
import Skeleton from "@mui/material/Skeleton";

export default function FormSkeleton() {
  return (
    <>
      <Skeleton variant="rounded" width={400} height={60} />
      <br />
      <Skeleton variant="rounded" width={400} height={60} />
      <br />
      <Skeleton variant="rounded" width={400} height={60} />
      <br />
      <Skeleton variant="rounded" width={400} height={60} />
    </>
  );
}
