import { z } from "zod";
import { validateResponse } from "./validationResponse";

const API_URL = "http://localhost:8845";

const SeminarSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().refine((date) => /^\d{2}\.\d{2}\.\d{4}$/.test(date), {
    message: "Invalid date format, expected dd.mm.yyyy",
  }),
  time: z.string().refine((time) => /^\d{2}:\d{2}$/.test(time), {
    message: "Invalid time format, expected hh:mm",
  }),
  photo: z.string().url(),
});
export type Seminar = z.infer<typeof SeminarSchema>;

const SeminarsSchema = z.array(SeminarSchema);
export type Seminars = z.infer<typeof SeminarsSchema>;

export const getSeminares = async () => {
  return fetch(`${API_URL}/seminars`, {
    method: "GET",
  })
    .then(validateResponse)
    .then((res) => res.json())
    .then((data) => SeminarsSchema.parse(data))
    .catch(() => {
      throw new Error("Failed to get seminar");
    });
};

export const removeSeminar = async (id: string) => {
  return fetch(`${API_URL}/seminars/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  })
    .then(validateResponse)
    .catch(() => {
      throw new Error("Failed to remove seminar");
    });
};

interface EditSeminarParams {
  id: string;
  data: Partial<Seminar>;
}

export const editSeminar = async ({ id, data }: EditSeminarParams) => {
  return fetch(`${API_URL}/seminars/${id}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(validateResponse)
    .catch(() => {
      throw new Error("Failed to edit seminar");
    });
};
