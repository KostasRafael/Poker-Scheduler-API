import express from "express";

import {
  getFestivalTournaments,
  createTournament,
  getTournament,
  updateTournament,
  deleteTournament,
} from "../controllers/tournaments.controller.js";

import { validate } from "../middleware/validate.js";

import {
  festivalIdParamSchema,
  tournamentIdParamSchema,
  createTournamentSchema,
  updateTournamentSchema,
} from "../validators/tournaments.validator.js";

const router = express.Router();

// Get all the tournaments that belong to a specific festival
router.get(
  "/festivals/:festivalId/tournaments",
  validate(festivalIdParamSchema, "params"),
  getFestivalTournaments
);

// Create a new touurnamnet within a specific festival
router.post(
  "/festivals/:festivalId/tournaments",
  validate(festivalIdParamSchema, "params"),
  validate(createTournamentSchema, "body"),
  createTournament
);

router.get(
  "/tournaments/:tournamentId",
  validate(tournamentIdParamSchema, "params"),
  getTournament
);

router.patch(
  "/tournaments/:tournamentId",
  validate(tournamentIdParamSchema, "params"),
  validate(updateTournamentSchema, "body"),
  updateTournament
);

router.delete(
  "/tournaments/:tournamentId",
  validate(tournamentIdParamSchema, "params"),
  deleteTournament
);

export default router;