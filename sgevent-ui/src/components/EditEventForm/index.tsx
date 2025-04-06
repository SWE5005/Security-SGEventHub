import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { navigate } from "gatsby";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DateTimeRangePicker from "../DateTimeRangePicker";
import QuantityInput from "../QuantityInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputFileUpload from "../FileUploader";
import LocationSelect from "../LocationSelect";
import ChipList from "../ChipList";

export default function EditEventForm({
  value,
  onSubmit,
  onDelete,
  isUpdating,
  isDeleting,
  isError,
  type,
  isChipDisabled = false,
  userList = [],
}) {
  const [event, setEvent] = React.useState();

  React.useEffect(() => {
    setEvent(value);
  }, [value]);

  return event ? (
    <Box>
      {type === "edit" ? (
        <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
          <TextField
            disabled
            id="event-id"
            label="Event Id"
            value={event.eventId}
          />
        </FormControl>
      ) : null}
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <InputFileUpload
          value={event.eventCover}
          label="Event Cover"
          disabled={type !== "edit" && type !== "add"}
          onChange={(value) => {
            setEvent((prev) => ({
              ...prev,
              eventCover: value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <TextField
          id="event-title"
          label="Title"
          value={event.eventTitle}
          disabled={type !== "edit" && type !== "add"}
          required
          onChange={(event) => {
            setEvent((prev) => ({
              ...prev,
              eventTitle: event.target.value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <TextField
          id="event-desc"
          label="Description"
          value={event.eventDesc}
          disabled={type !== "edit" && type !== "add"}
          required
          onChange={(event) => {
            setEvent((prev) => ({
              ...prev,
              eventDesc: event.target.value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <QuantityInput
          aria-label="Capacity"
          label="Capacity"
          defaultValue={value.eventCapacity}
          min={1}
          max={1000}
          required
          disabled={type !== "edit" && type !== "add"}
          onChange={(event, value) => {
            setEvent((prev) => ({
              ...prev,
              eventCapacity: value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <DateTimeRangePicker
          label="Duration"
          defaultStartVal={event.eventStartDt}
          defaultEndVal={event.eventEndDt}
          disabled={type !== "edit" && type !== "add"}
          onChange={(values) => {
            if (values.length !== 2) return;
            setEvent((prev) => ({
              ...prev,
              eventStartDt: values?.[0]?.format(),
              eventEndDt: values?.[1]?.format(),
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <LocationSelect
          label="Location"
          value={value.eventPlace}
          disabled={type !== "edit" && type !== "add"}
          onChange={(event, value) => {
            setEvent((prev) => ({
              ...prev,
              eventPlace: value,
            }));
          }}
        />
      </FormControl>
      {type === "view" ? (
        <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
          <FormLabel component="legend">Event Member List</FormLabel>
          <ChipList
            disabled={isChipDisabled}
            eventId={value.eventId}
            items={userList}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </FormControl>
      ) : null}
      <br />
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        {isError ? (
          <FormLabel error id="error-update-user">
            Something went wrong while adding/updating event, Please try again
            later.
          </FormLabel>
        ) : null}
        <br />
        <br />
        <br />
        <br />
        <Stack spacing={2} direction="row">
          {type !== "view" ? (
            <LoadingButton
              fullWidth
              variant="contained"
              type="submit"
              loadingPosition="end"
              loading={isUpdating}
              onClick={() => {
                onSubmit(event);
              }}
            >
              Submit
            </LoadingButton>
          ) : null}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              navigate("/events");
            }}
          >
            Back to Event Home
          </Button>
        </Stack>
      </FormControl>
    </Box>
  ) : null;
}
