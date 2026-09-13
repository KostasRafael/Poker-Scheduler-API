import Festival from "../models/festival.model.js";
import Tournament from "../models/tournament.model.js";

export const getTournamentsByFestival = async (festivalId) => {
  const festival = await Festival.findById(festivalId);

  if (!festival) {
    const error = new Error("Festival not found");
    error.statusCode = 404;
    error.code = "FESTIVAL_NOT_FOUND";
    throw error;
  }

  const tournaments = await Tournament.find({ festivalId });

  return tournaments;
};


export const createNewTournament = async (
  festivalId,
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
  const festival = await Festival.findById(festivalId);

  if (!festival) {
    const error = new Error("Festival not found");
    error.statusCode = 404;
    error.code = "FESTIVAL_NOT_FOUND";
    throw error;
  }

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

export const getTournamentById = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    error.code = "TOURNAMENT_NOT_FOUND";
    throw error;
  }

  return tournament;
};


export const updateTournamentById = async (
  tournamentId,
  tournamentData
) => {
  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    error.code = "TOURNAMENT_NOT_FOUND";
    throw error;
  }

  const festival = await Festival.findById(
    tournament.festivalId
  );

  if (!festival) {
    const error = new Error("Festival not found");
    error.statusCode = 404;
    error.code = "FESTIVAL_NOT_FOUND";
    throw error;
  }

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

export const deleteTournamentById = async (tournamentId) => {
  const tournament = await Tournament.findByIdAndDelete(
    tournamentId
  );

  if (!tournament) {
    const error = new Error("Tournament not found");
    error.statusCode = 404;
    error.code = "TOURNAMENT_NOT_FOUND";
    throw error;
  }
};