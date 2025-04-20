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

export interface FileUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const InputFileUpload: React.FC<FileUploaderProps> = ({ label, value, onChange, disabled }) => {
  const [picture, setPicture] = React.useState("");
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toBase64(e.target.files[0], (value: string) => {
        onChange(value);
      });
      e.target.value = '';
    }
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

export default InputFileUpload;