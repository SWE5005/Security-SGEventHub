import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/models/pickers";
import { DateTimeRangeValidationError } from "@mui/x-date-pickers-pro/models/validation";
import { DateRange } from "@mui/lab/DateRangePicker/DateRangePicker";

export interface DateTimeRangePickerInputProps {
  defaultStartVal: string;
  defaultEndVal: string;
  label: string;
  onChange: (value: DateRange<Dayjs>, context: PickerChangeHandlerContext<DateTimeRangeValidationError>) => void;
  disabled: boolean;
}

export default function DateTimeRangePickerInput({
  defaultStartVal,
  defaultEndVal,
  label,
  onChange,
  disabled,
}: DateTimeRangePickerInputProps) {
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
