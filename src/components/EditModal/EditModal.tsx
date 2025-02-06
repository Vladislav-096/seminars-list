import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
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
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { convertDate } from "../../utils/convertDate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { convertTime } from "../../utils/convertTime";
import { CustomErrorAlert } from "../CustomErrorAlert/CustomErrorAlert";

interface EditModal {
  open: boolean;
  handleClose: () => void;
  row: Seminar;
}

interface FormTypes {
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}

const textRules = {
  required: "This field is required",
};

const dateRules = {
  required: "This field is required",
  pattern: {
    value: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
    message: "Please enter date in format dd.mm.yyyy",
  },
};

const urlRules = {
  required: "This field is required",
  pattern: {
    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w\s.-]*)*\/?$/,
    message: "Please enter a valid URL",
  },
};

const errorTitle: string = "Failed to edit seminar";

export const EditModal = ({ open, handleClose, row }: EditModal) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(""); // YYYY-MM-DD
  const [convertedTime, setConvertedTime] = useState<string>(""); // YYYY-MM-DDTHH:mm
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [alertStatus, setAlertStatus] = useState<boolean>(false);

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue("title", value);
    setTitle(value);
    trigger("title");
  };

  const handleOnDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setValue("description", value);
    setDescription(value);
    trigger("description");
  };

  const handleOnDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setValue("date", newValue.format("DD.MM.YYYY"));
      setDate(newValue.format("YYYY-MM-DD"));
      trigger("date");
    }
  };

  const handleOnTimeChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      console.log(newValue.format("HH:mm"));
      setConvertedTime(newValue.format("YYYY-MM-DDTHH:mm"));
      setValue("time", newValue.format("HH:mm"));
      trigger("time");
    }
  };

  const handleOnPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue("photo", value);
    setPhotoUrl(value);
    trigger("photo");
  };

  const editSeminarMutation = useMutation(
    {
      mutationFn: editSeminar,
      onSuccess() {
        console.log("editSeminarMutation success");
        queryClient.invalidateQueries({ queryKey: ["seminars"] });
        handleClose();
      },
      onError(err) {
        console.log("editSeminarMutation error", err);
        setAlertStatus(true);
      },
    },
    queryClient
  );

  const resetForm = () => {
    setValue("title", "");
    setValue("description", "");
    setValue("date", "");
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
    trigger,
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
      const combinedDate = convertTime(row.time);

      setTitle(row.title);
      setDescription(row.description);
      setDate(convertDate(row.date));
      setConvertedTime(combinedDate);
      setPhotoUrl(row.photo);
      setValue("title", row.title);
      setValue("description", row.description);
      setValue("date", row.date);
      setValue("time", row.time);
      setValue("photo", row.photo);
    }
  }, [row]);

  return (
    <>
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
                  rules={textRules}
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
              <FormControl fullWidth>
                <Controller
                  name="description"
                  control={control}
                  rules={textRules}
                  render={() => (
                    <TextField
                      value={description}
                      onChange={handleOnDescriptionChange}
                      error={errors.description ? true : false}
                      helperText={errors.description?.message}
                      label="Description"
                    />
                  )}
                />
              </FormControl>
              <FormControl error={errors.date ? true : false} fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="date"
                    control={control}
                    rules={dateRules}
                    render={() => (
                      <DatePicker
                        label="Date"
                        value={dayjs(date)}
                        onChange={handleOnDateChange}
                        format="DD.MM.YYYY"
                        slots={{ textField: TextField }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.date && (
                  <FormHelperText>{errors.date.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl error={errors.time ? true : false} fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="time"
                    control={control}
                    rules={textRules}
                    render={() => (
                      <TimePicker
                        label="Time"
                        value={dayjs(convertedTime)}
                        onChange={handleOnTimeChange}
                        // format="HH:mm"
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.time && (
                  <FormHelperText>{errors.time.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <Controller
                  name="photo"
                  control={control}
                  rules={urlRules}
                  render={() => (
                    <TextField
                      value={photoUrl}
                      onChange={handleOnPhotoChange}
                      error={errors.photo ? true : false}
                      helperText={errors.photo?.message}
                      label="Photo URL"
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
      <CustomErrorAlert
        alertStatus={alertStatus}
        setAlertStatus={setAlertStatus}
        title={errorTitle}
      />
    </>
  );
};
