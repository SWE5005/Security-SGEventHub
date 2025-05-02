import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { navigate } from 'gatsby';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DateTimeRangePicker from '../DateTimeRangePicker';
import QuantityInput from '../QuantityInput';
import InputFileUpload from '../FileUploader';
import LocationSelect from '../LocationSelect';
import ChipList from '../ChipList';
import dayjs from 'dayjs';
import { TIME_FORMAT } from '../../constants';
export interface EditEventFormProps {
  value: any;
  type: string;
  onSubmit?: (value: any) => void;
  onDelete?: (value: any) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isError?: boolean;
  isChipDisabled?: boolean;
}

const EditEventForm: React.FC<EditEventFormProps> = ({
  value,
  onSubmit,
  onDelete,
  isUpdating,
  isDeleting,
  isError,
  type,
  isChipDisabled = false,
}) => {
  const [event, setEvent] = React.useState<SgehEvent>({} as SgehEvent);

  React.useEffect(() => {
    setEvent(value);
  }, [value]);

  return event ? (
    <Box>
      {type === 'edit' ? (
        <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
          <TextField disabled id="event-id" label="Event Id" value={event?.id} />
        </FormControl>
      ) : null}
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <InputFileUpload
          value={event?.cover}
          label="Event Cover"
          disabled={type !== 'edit' && type !== 'add'}
          onChange={value => {
            setEvent(prev => ({
              ...prev,
              cover: value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <TextField
          id="event-title"
          label="Title"
          value={event?.title}
          disabled={type !== 'edit' && type !== 'add'}
          required
          onChange={event => {
            setEvent(prev => ({
              ...prev,
              title: event.target.value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <TextField
          id="event-desc"
          label="Description"
          value={event?.description}
          disabled={type !== 'edit' && type !== 'add'}
          required
          onChange={event => {
            setEvent(prev => ({
              ...prev,
              description: event.target.value,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <QuantityInput
          aria-label="Capacity"
          label="Capacity"
          defaultValue={value?.capacity}
          min={1}
          max={1000}
          required
          disabled={type !== 'edit' && type !== 'add'}
          onChange={(event, value) => {
            setEvent(prev => ({
              ...prev,
              capacity: value ? value : 0,
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <DateTimeRangePicker
          label="Duration"
          defaultStartVal={event?.startDatetime}
          defaultEndVal={event?.endDatetime}
          disabled={type !== 'edit' && type !== 'add'}
          onChange={values => {
            if (values.length !== 2) return;
            const startDatetime = values[0]?.format(TIME_FORMAT);
            const endDatetime = values[1]?.format(TIME_FORMAT);
            setEvent(prev => ({
              ...prev,
              startDatetime: startDatetime || dayjs().format(TIME_FORMAT),
              endDatetime: endDatetime || dayjs().format(TIME_FORMAT),
            }));
          }}
        />
      </FormControl>
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        <LocationSelect
          label="Location"
          value={value?.location}
          disabled={type !== 'edit' && type !== 'add'}
          onChange={(event, value) => {
            setEvent(prev => ({
              ...prev,
              location: value,
            }));
          }}
        />
      </FormControl>
      {type === 'view' ? (
        <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
          <FormLabel component="legend">Event Member List</FormLabel>
          <ChipList
            disabled={isChipDisabled}
            eventId={value?.id}
            items={value?.userList}
            onDelete={onDelete}
            isDeleting={isDeleting ? isDeleting : false}
          />
        </FormControl>
      ) : null}
      <br />
      <FormControl sx={{ width: 1 / 2, mb: 2, mr: 2 }} variant="standard">
        {isError ? (
          <FormLabel error id="error-update-user">
            Something went wrong while adding/updating event, Please try again later.
          </FormLabel>
        ) : null}
        <br />
        <br />
        <br />
        <br />
        <Stack spacing={2} direction="row">
          {type !== 'view' ? (
            <LoadingButton
              fullWidth
              variant="contained"
              type="submit"
              loadingPosition="end"
              loading={isUpdating}
              onClick={() => {
                if (onSubmit && event) {
                  onSubmit(event);
                }
              }}
            >
              Submit
            </LoadingButton>
          ) : null}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              navigate('/events');
            }}
          >
            Back to Event Home
          </Button>
        </Stack>
      </FormControl>
    </Box>
  ) : null;
};

export default EditEventForm;
