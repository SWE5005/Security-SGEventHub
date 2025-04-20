import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toBase64 } from "../../utils";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({ label, value, onChange, disabled }) {
  const [picture, setPicture] = React.useState("");
  const onUpload = (e) => {
    // setPicture(URL.createObjectURL(e.target.files[0]));
    toBase64(e.target.files[0], (value) => {
      onChange(value);
    });
    e.target.value = null;
  };
  React.useEffect(() => {
    setPicture(value);
  }, [value]);
  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        disabled={disabled}
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        {label}
        <VisuallyHiddenInput
          type="file"
          accept="image/png, image/jpeg"
          onChange={onUpload}
        />
      </Button>
      <br />
      <img className="playerProfilePic_home_tile" src={picture}></img>
    </>
  );
}
