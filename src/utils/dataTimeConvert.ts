import dayjs from "dayjs";

export const convertDate = (date: string) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export const convertTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return dayjs()
    .set("hour", hours)
    .set("minute", minutes)
    .format("YYYY-MM-DDTHH:mm");
};
