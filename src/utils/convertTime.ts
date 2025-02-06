import dayjs from "dayjs";

export const convertTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return dayjs()
    .set("hour", hours)
    .set("minute", minutes)
    .format("YYYY-MM-DDTHH:mm");
};
