import {
  getTournamentsByFestival,
  createNewTournament,
  getTournamentById,
  updateTournamentById,
  deleteTournamentById,
} from "../services/tournaments.service.js";

export const getFestivalTournaments = async (req, res, next) => {
  try {
    const tournaments = await getTournamentsByFestival(
      req.params.festivalId,
      req.user.id
    );

    res.status(200).json(tournaments);
  } catch (error) {
    next(error);
  }
};

export const createTournament = async (req, res, next) => {
  try {
    const tournament = await createNewTournament(
      req.params.festivalId,
      req.user.id,
      req.body
    );

    console.log("req.params.festivalId in createTournament controller", req.params.festivalId);

    res.status(201).json(tournament);
  } catch (error) {
    next(error);
  }
};

export const getTournament = async (req, res, next) => {
  try {
    const tournament = await getTournamentById(
      req.params.tournamentId,
      req.user.id
    );

    res.status(200).json(tournament);
  } catch (error) {
    next(error);
  }
};

export const updateTournament = async (req, res, next) => {
  try {
    const tournament = await updateTournamentById(
      req.params.tournamentId,
      req.user.id,
      req.body
    );

    res.status(200).json(tournament);
  } catch (error) {
    next(error);
  }
};

export const deleteTournament = async (req, res, next) => {
  try {
    await deleteTournamentById(req.params.tournamentId, req.user.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};