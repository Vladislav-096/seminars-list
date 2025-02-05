import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { modalContentStyles } from "../../constants/constants";
import { useMutation } from "@tanstack/react-query";
import { removeSeminar } from "../../api/seminars";
import { queryClient } from "../../api/queryClient";

interface ConfirmRemoveModal {
  open: boolean;
  handleClose: () => void;
  idToRemove: string;
}

export const ConfirmRemoveModal = ({
  open,
  handleClose,
  idToRemove,
}: ConfirmRemoveModal) => {
  const removeSeminarMutation = useMutation(
    {
      mutationFn: removeSeminar,
      onSuccess() {
        console.log("removeSeminarMutation success");
        queryClient.invalidateQueries({ queryKey: ["seminares"] });
      },
      onError(err) {
        console.log("removeSeminarMutation error", err);
      },
    },
    queryClient
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 200,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalContentStyles}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontFamily: '"Play"', color: "#f0f6fc" }}
          >
            Are you sure you'd like to remove the seminar?
          </Typography>
          <Stack spacing={2} direction="row">
            <Button
              onClick={() => {
                removeSeminarMutation.mutate(idToRemove);
                handleClose();
              }}
              variant="contained"
            >
              Yes
            </Button>
            <Button onClick={handleClose} variant="contained">
              No
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
