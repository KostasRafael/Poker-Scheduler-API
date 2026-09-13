import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine(
  (value) => mongoose.Types.ObjectId.isValid(value),
  {
    message: "Invalid festival ID",
  }
);

export const festivalIdParamSchema = z.object({
  festivalId: objectIdSchema,
});

export const createFestivalSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required"),

    venue: z
      .string()
      .trim()
      .min(1, "Venue is required"),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  })
  .refine(
    (data) => data.startDate <= data.endDate,
    {
      message: "Start date must be before or equal to end date",
      path: ["startDate"],
    }
  );

  export const updateFestivalSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  )
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      data.startDate <= data.endDate,
    {
      message: "Start date must be before or equal to end date",
      path: ["startDate"],
    }
  );