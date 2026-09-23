import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../../Redux/Reducer/ToastReducer";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CommonSnackbar = () => {
  const { message, type } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearToast()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
};

export default CommonSnackbar;
