import Festival from "../models/festival.model.js";
import Tournament from "../models/tournament.model.js";

export const getAllFestivals = async () => {
  const festivals = await Festival.find();

  return festivals;
};

export const createNewFestival = async ({
  title,
  venue,
  startDate,
  endDate,
}) => {
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error("Festival start date must be before end date");
  }

  const festival = await Festival.create({
    title,
    venue,
    startDate,
    endDate,
  });

  return festival;
};

export const getFestivalById = async (festivalId) => {
  const festival = await Festival.findById(festivalId);

  if (!festival) {
    const error = new Error("Festival not found");
    error.statusCode = 404;
    error.code = "FESTIVAL_NOT_FOUND";
    throw error;
  }

  return festival;
};


  export const updateFestivalById = async (
  festivalId,
  festivalData
) => {
  const festival = await Festival.findById(festivalId);

  if (!festival) {
    const error = new Error("Festival not found");
    error.statusCode = 404;
    error.code = "FESTIVAL_NOT_FOUND";
    throw error;
  }

  const updatedStartDate =
    festivalData.startDate ?? festival.startDate;

  const updatedEndDate =
    festivalData.endDate ?? festival.endDate;

  if (updatedStartDate > updatedEndDate) {
    const error = new Error(
      "Start date must be before or equal to end date"
    );
    error.statusCode = 400;
    error.code = "INVALID_DATE_RANGE";
    throw error;
  }

  const tournamentOutsideFestival =
    await Tournament.findOne({
      festivalId,
      $or: [
        {
          startDate: { $lt: updatedStartDate },
        },
        {
          endDate: { $gt: updatedEndDate },
        },
      ],
    });

  if (tournamentOutsideFestival) {
    const error = new Error(
      "Festival dates cannot exclude existing tournaments"
    );
    error.statusCode = 400;
    error.code = "TOURNAMENT_OUTSIDE_FESTIVAL_DATES";
    throw error;
  }

  const allowedFields = [
    "title",
    "startDate",
    "endDate",
  ];

  for (const field of allowedFields) {
    if (festivalData[field] !== undefined) {
      festival[field] = festivalData[field];
    }
  }

  await festival.save();

  return festival;
};

export const deleteFestivalById = async (festivalId) => {
  const festival = await Festival.findById(festivalId);

  if (!festival) {
    const error = new Error("Festival not found");
    error.statusCode = 404;
    error.code = "FESTIVAL_NOT_FOUND";
    throw error;
  }

  await Tournament.deleteMany({ festivalId });

  await festival.deleteOne();
};