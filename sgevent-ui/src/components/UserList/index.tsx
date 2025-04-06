import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteModal from "../DeleteModal";
import {
  useGetUserListQuery,
  useDeleteUserMutation,
} from "../../services/user.service";
import { navigate } from "gatsby";

export default function UserList() {
  const { data, error, isLoading, refetch } = useGetUserListQuery();
  const [deleteUser, result] = useDeleteUserMutation();
  const onEditClick = (userId) => {
    navigate(`/users/edit?userId=${userId}`);
  };
  React.useEffect(() => {
    if (result.isSuccess) refetch();
  }, [result]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>UserName</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row.userId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.userId}
              </TableCell>
              <TableCell>{row.userName}</TableCell>
              <TableCell>{row.activeStatus}</TableCell>
              <TableCell>{row.emailAddress}</TableCell>
              <TableCell>{row.roleId}</TableCell>
              <TableCell sx={{ display: "flex" }}>
                <IconButton
                  color="primary"
                  aria-label="Edit User"
                  onClick={() => {
                    onEditClick(row.userId);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <DeleteModal
                  onDelete={() => {
                    deleteUser(row.userId);
                  }}
                  title="Delete User?"
                  label="Are you sure to delete this user?"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
