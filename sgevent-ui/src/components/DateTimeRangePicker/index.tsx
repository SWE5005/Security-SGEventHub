import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";

export default function DateTimeRangePickerInput({
  defaultStartVal,
  defaultEndVal,
  label,
  onChange,
  disabled,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={["DateTimeRangePicker", "DateTimeRangePicker"]}
      >
        <DemoItem label={label} component="DateTimeRangePicker">
          <DateTimeRangePicker
            disabled={disabled}
            defaultValue={[dayjs(defaultStartVal), dayjs(defaultEndVal)]}
            onChange={onChange}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
