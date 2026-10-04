import { getAllFestivals,
         createNewFestival,
         getFestivalById,
         updateFestivalById,
         deleteFestivalById,
 } from "../services/festivals.service.js";

export const getFestivals = async (req, res, next) => {
  try {
    const festivals = await getAllFestivals(req.user.id);

    res.status(200).json(festivals);
  } catch (error) {
    next(error);
  }
};

export const createFestival = async (req, res, next) => {
  try {
    const festival = await createNewFestival(req.user.id, req.body);

    res.status(201).json(festival);
  } catch (error) {
    next(error);
  }
};

export const getFestival = async (req, res, next) => {
  try {
    const festival = await getFestivalById(
      req.params.festivalId,
      req.user.id
    );

    res.status(200).json(festival);
  } catch (error) {
    next(error);
  }
};

export const updateFestival = async (req, res, next) => {
  try {
    const festival = await updateFestivalById(
      req.params.festivalId,
      req.user.id,
      req.body
    );

    res.status(200).json(festival);
  } catch (error) {
    next(error);
  }
};


export const deleteFestival = async (req, res, next) => {
  try {
    await deleteFestivalById(req.params.festivalId, req.user.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};