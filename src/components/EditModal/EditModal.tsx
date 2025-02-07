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
import { modalContentStyles, textFieldStyle } from "../../constants/constants";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomErrorAlert } from "../CustomErrorAlert/CustomErrorAlert";
import { convertDate, convertTime } from "../../utils/dataTimeConvert";

// Интерфейсы для пропсов модального окна и формы
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

// Правила валидации для полей формы
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
  // Локальное состояние для управления полями формы
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(""); // YYYY-MM-DD
  const [convertedTime, setConvertedTime] = useState<string>(""); // YYYY-MM-DDTHH:mm
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [alertStatus, setAlertStatus] = useState<boolean>(false);

  // Обработчики обновления состояния при изменении полей формы
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

  // Мутация для отправки изменений на сервер
  const editSeminarMutation = useMutation(
    {
      mutationFn: editSeminar,
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["seminars"] });
        handleClose();
      },
      onError() {
        setAlertStatus(true);
      },
    },
    queryClient
  );

  // Сброс формы
  const resetForm = () => {
    setValue("title", "");
    setValue("description", "");
    setValue("date", "");
    reset();
    clearErrors();
  };

  // Инициализация формы и обработка отправки
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
    const formattedData = {
      id: row.id,
      data: formData,
    };

    editSeminarMutation.mutate(formattedData);
    resetForm();
  };

  // useEffect заполняет данные при открытии модального окна
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
              sx={{
                marginBottom: "20px",
                fontFamily: '"Play"',
                color: "#f0f6fc",
              }}
            >
              Edit seminar
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl sx={{ marginBottom: "20px" }} fullWidth>
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
                      sx={textFieldStyle}
                    />
                  )}
                />
              </FormControl>
              <FormControl sx={{ marginBottom: "20px" }} fullWidth>
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
                      sx={textFieldStyle}
                    />
                  )}
                />
              </FormControl>
              <FormControl
                sx={{ marginBottom: "20px" }}
                error={errors.date ? true : false}
                fullWidth
              >
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
                        sx={textFieldStyle}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.date && (
                  <FormHelperText>{errors.date.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                sx={{ marginBottom: "20px" }}
                error={errors.time ? true : false}
                fullWidth
              >
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
                        sx={textFieldStyle}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.time && (
                  <FormHelperText>{errors.time.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl sx={{ marginBottom: "20px" }} fullWidth>
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
                      sx={textFieldStyle}
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
