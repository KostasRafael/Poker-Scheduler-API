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

export const createTournamentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required"),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    buyIn: z.number().min(0, "Buy-in cannot be negative"),

    startingStack: z
      .number()
      .int("Starting stack must be a whole number")
      .positive("Starting stack must be greater than 0"),

    rebuys: z.boolean(),

    days: z
      .number()
      .int("Days must be a whole number")
      .positive("Days must be greater than 0"),
  })
  .refine(
    (data) => data.startDate <= data.endDate,
    {
      message: "Start date must be before or equal to end date",
      path: ["startDate"],
    }
  );

  export const tournamentIdParamSchema = z.object({
  tournamentId: z.string().refine(
    (value) => mongoose.Types.ObjectId.isValid(value),
    {
      message: "Invalid tournament ID",
    }
  ),
});

export const updateTournamentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    buyIn: z
      .number()
      .min(0, "Buy-in cannot be negative")
      .optional(),

    startingStack: z
      .number()
      .int("Starting stack must be a whole number")
      .positive("Starting stack must be greater than 0")
      .optional(),

    rebuys: z.boolean().optional(),

    days: z
      .number()
      .int("Days must be a whole number")
      .positive("Days must be greater than 0")
      .optional(),
  })

  // Reject PATCH requests with an empty body: {}
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  )

 // If both dates are provided, make sure their range is valid
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