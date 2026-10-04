import Festival from "../models/festival.model.js";
import Tournament from "../models/tournament.model.js";
import { getFestivalById } from "./festivals.service.js";

// Tournaments are owned through their festival: a tournament is only
// found if its festival belongs to the given user
const findUserTournament = async (tournamentId, userId) => {
  const tournament = await Tournament.findById(tournamentId);

  const festival =
    tournament &&
    (await Festival.findOne({ _id: tournament.festivalId, userId }));

  if (!festival) {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    error.code = "TOURNAMENT_NOT_FOUND";
    throw error;
  }

  return { tournament, festival };
};

export const getTournamentsByFestival = async (festivalId, userId) => {
  await getFestivalById(festivalId, userId);

  const tournaments = await Tournament.find({ festivalId });

  return tournaments;
};


export const createNewTournament = async (
  festivalId,
  userId,
  {
    title,
    startDate,
    endDate,
    buyIn,
    startingStack,
    rebuys,
    days,
  }
) => {
  const festival = await getFestivalById(festivalId, userId);

  if (
    startDate < festival.startDate ||
    endDate > festival.endDate
  ) {
    const error = new Error(
      "Tournament dates must be within the festival dates"
    );
    error.statusCode = 400;
    error.code = "TOURNAMENT_OUTSIDE_FESTIVAL_DATES";
    throw error;
  }

  const tournament = await Tournament.create({
    festivalId,
    title,
    startDate,
    endDate,
    buyIn,
    startingStack,
    rebuys,
    days,
  });

  return tournament;
};

export const getTournamentById = async (tournamentId, userId) => {
  const { tournament } = await findUserTournament(tournamentId, userId);

  return tournament;
};


export const updateTournamentById = async (
  tournamentId,
  userId,
  tournamentData
) => {
  const { tournament, festival } = await findUserTournament(
    tournamentId,
    userId
  );

  const updatedStartDate =
    tournamentData.startDate ?? tournament.startDate;

  const updatedEndDate =
    tournamentData.endDate ?? tournament.endDate;

  if (updatedStartDate > updatedEndDate) {
    const error = new Error(
      "Start date must be before or equal to end date"
    );
    error.statusCode = 400;
    error.code = "INVALID_DATE_RANGE";
    throw error;
  }

  if (
    updatedStartDate < festival.startDate ||
    updatedEndDate > festival.endDate
  ) {
    const error = new Error(
      "Tournament dates must be within the festival dates"
    );
    error.statusCode = 400;
    error.code = "TOURNAMENT_OUTSIDE_FESTIVAL_DATES";
    throw error;
  }

  const allowedFields = [
    "title",
    "startDate",
    "endDate",
    "buyIn",
    "startingStack",
    "rebuys",
    "days",
  ];

  for (const field of allowedFields) {
    if (tournamentData[field] !== undefined) {
      tournament[field] = tournamentData[field];
    }
  }

  await tournament.save();

  return tournament;
};

export const deleteTournamentById = async (tournamentId, userId) => {
  const { tournament } = await findUserTournament(tournamentId, userId);

  await tournament.deleteOne();
};