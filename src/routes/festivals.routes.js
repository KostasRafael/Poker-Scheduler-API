import express from "express";
import { 
    getFestivals, 
    createFestival,
    getFestival,
    updateFestival,
    deleteFestival, 
} from "../controllers/festivals.controller.js";

import { validate } from "../middleware/validate.js";

import {
  festivalIdParamSchema,
  createFestivalSchema,
  updateFestivalSchema,
} from "../validators/festivals.validator.js";

const router = express.Router();

router.get("/", getFestivals);

router.post(
  "/",
  validate(createFestivalSchema, "body"),
  createFestival
);

router.get(
  "/:festivalId",
  validate(festivalIdParamSchema, "params"),
  getFestival
);

router.patch(
  "/:festivalId",
  validate(festivalIdParamSchema, "params"),
  validate(updateFestivalSchema, "body"),
  updateFestival
);

router.delete(
  "/:festivalId",
  validate(festivalIdParamSchema, "params"),
  deleteFestival
);

export default router;