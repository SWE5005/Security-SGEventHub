import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { STATUS_OPTIONS } from "../../constants/index";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { navigate } from "gatsby";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export interface EditUserFormProps {
	value: any;
	roleList: any[];
	onSubmit: (user: any) => void;
	isUpdating: boolean;
	isError: boolean;
	isEdit: boolean;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ value, roleList, onSubmit, isUpdating, isError, isEdit }) => {
	const [user, setUser] = React.useState<any>();

	React.useEffect(() => {
		setUser(value);
	}, [value]);

	return user ? (
		<Box>
			{isEdit ? (
				<FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
					<TextField disabled id="user-id" label="User Id" value={user.userId} />
				</FormControl>
			) : null}

			<FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
				<TextField
					id="user-email"
					label="Email Address"
					disabled={isEdit}
					value={user.emailAddress}
					onChange={(event) => {
						setUser((prev) => ({
							...prev,
							emailAddress: event.target.value,
						}));
					}}
				/>
			</FormControl>

			<FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
				<TextField
					id="user-name"
					label="Name"
					value={user.userName}
					onChange={(event) => {
						setUser((prev) => ({
							...prev,
							userName: event.target.value,
						}));
					}}
				/>
			</FormControl>

			<FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
				<TextField
					id="outlined-select-status"
					select
					label="Status"
					value={user.activeStatus}
					helperText="Please select account status"
					onChange={(event) => {
						setUser((prev) => ({
							...prev,
							activeStatus: event.target.value,
						}));
					}}
				>
					{STATUS_OPTIONS.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</TextField>
			</FormControl>

			<FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
				<TextField
					id="outlined-select-role"
					select
					label="Role"
					value={user.roleId}
					helperText="Please select role"
					onChange={(event) => {
						setUser((prev) => ({ ...prev, roleId: event.target.value }));
					}}
				>
					{roleList?.map((option) => (
						<MenuItem key={option.roleId} value={option.roleId}>
							{option.roleName}
						</MenuItem>
					))}
				</TextField>
			</FormControl>

			<br />
			<FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
				{isError ? (
					<FormLabel error id="error-update-user">
						Something went wrong while adding/updating user, Please try again later.
					</FormLabel>
				) : null}
				<Stack spacing={2} direction="row">
					<LoadingButton
						fullWidth
						variant="contained"
						type="submit"
						loadingPosition="end"
						loading={isUpdating}
						onClick={() => {
							onSubmit(user);
						}}
					>
						Submit
					</LoadingButton>
					<Button
						fullWidth
						variant="outlined"
						onClick={() => {
							navigate("/users");
						}}
					>
						Back
					</Button>
				</Stack>
			</FormControl>
		</Box>
	) : null;
}

export default EditUserForm;