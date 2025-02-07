export const modalContentStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#0d1117",
  padding: "15px",
  borderRadius: "5px",
  textAlign: "center",
};

export const initialRowData = {
  id: "",
  title: "",
  description: "",
  date: "",
  time: "",
  photo: "",
};

export const textFieldStyle = {
  ".MuiInputLabel-root": {
    color: "#9198a1",
    "&.Mui-focused": {
      color: "#9198a1",
    },
  },
  ".MuiInputBase-root": {
    backgroundColor: "#151b23",
  },
  ".MuiOutlinedInput-root": {
    input: {
      color: "#f0f6fc",
      backgroundColor: "#151b23",
      borderRadius: "5px",
    },
    fieldSet: {
      border: "1px solid #3d444db3",
    },
    "&:hover fieldset": {
      border: "1px solid #9198a1",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #9198a1",
    },
  },
  ".MuiSvgIcon-root": {
    color: "#f0f6fc", // Цвет иконки
  },
};
