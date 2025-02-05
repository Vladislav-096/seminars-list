import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { editSeminar, Seminar } from "../../api/seminars";
import { modalContentStyles } from "../../constants/constants";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";
import { useEffect, useState } from "react";

interface EditModal {
  open: boolean;
  handleClose: () => void;
  row: Seminar;
}

interface FormTypes {
  title: string;
}

const testRules = {
  required: "Надо заполнить",
};

export const EditModal = ({ open, handleClose, row }: EditModal) => {
  const [title, setTitle] = useState<string>("");

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue("title", value);
    setTitle(value);
  };

  const editSeminarMutation = useMutation(
    {
      mutationFn: editSeminar,
      onSuccess() {
        console.log("editSeminarMutation success");
        queryClient.invalidateQueries({ queryKey: ["seminares"] });
        handleClose();
      },
      onError(err) {
        console.log("editSeminarMutation error", err);
      },
    },
    queryClient
  );

  const resetForm = () => {
    setValue("title", "");
    reset();
    clearErrors();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    // trigger,
  } = useForm<FormTypes>();

  const onSubmit = (formData: FormTypes) => {
    console.log("formData", formData);

    const formattedData = {
      id: row.id,
      data: formData,
    };

    editSeminarMutation.mutate(formattedData);
    resetForm();
  };

  useEffect(() => {
    if (row) {
      setTitle(row.title);
      setValue("title", row.title);
    }
  }, [row]);

  return (
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
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
            Edit seminar
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <Controller
                name="title"
                control={control}
                rules={testRules}
                render={() => (
                  <TextField
                    value={title}
                    onChange={handleOnTitleChange}
                    error={errors.title ? true : false}
                    helperText={errors.title?.message}
                    label="Title"
                  />
                )}
              />
            </FormControl>
            <Button type="submit" variant="contained">
              submit
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
