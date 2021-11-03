import { TextField } from "@mui/material";

export default function CustomTextField(props) {
  const {
    label = "",
    name = "",
    value = "",
    onChange,
    disabled = false,
  } = props;
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      style={{ margin: "30px" }}
      disabled={disabled}
    />
  );
}
