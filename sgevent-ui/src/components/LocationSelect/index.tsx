import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchLocationMutation } from "../../services/map.service";
import debounce from "lodash/debounce";

export default function LocationSelect({ label, value, onChange, disabled }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [searchLocation, result] = useSearchLocationMutation();

  React.useEffect(() => {
    if (!result.isSuccess || !result.data) return;
    const opts = result.data.results.map((item) => item.ADDRESS);
    setOptions(opts);
    setOpen(true);
  }, [result.data]);

  const onInputChange = React.useCallback(
    (e, input) => {
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
      onChange={onChange}
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
