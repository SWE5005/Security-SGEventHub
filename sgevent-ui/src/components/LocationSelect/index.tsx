import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchLocationMutation } from "../../services/map.service";
import debounce from "lodash/debounce";

interface LocationSelectProps {
  label: string;
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
  disabled?: boolean;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ label, value, onChange, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const [searchLocation, result] = useSearchLocationMutation();

  React.useEffect(() => {
    if (!result.isSuccess || !result.data) return;
    const opts = result.data.results.map((item) => item.ADDRESS);
    setOptions(opts);
    setOpen(true);
  }, [result.data]);

  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent, input: string) => {
      if (!input || input === value) return;

      searchLocation(input);
    },
    [searchLocation]
  );

  return (
    <Autocomplete
      id="location-select"
      open={open}
      defaultValue={value}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disabled={disabled}
      onInputChange={debounce(onInputChange, 500)}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      onChange={(event, newValue) => {
        onChange(event, newValue || '');
      }}
      loading={result.isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {result.isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

export default LocationSelect;