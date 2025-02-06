import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";

interface CustomErrorAlert {
  title: string;
  alertStatus: boolean;
  setAlertStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomErrorAlert = ({
  title,
  alertStatus,
  setAlertStatus,
}: CustomErrorAlert) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertStatus(false);
  };

  return (
    <>
      <Snackbar
        open={alertStatus}
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert variant="filled" severity="error">
          {title}
        </Alert>
      </Snackbar>
    </>
  );
};
