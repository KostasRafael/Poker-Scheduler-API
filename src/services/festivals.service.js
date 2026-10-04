import Festival from "../models/festival.model.js";
import Tournament from "../models/tournament.model.js";

export const getAllFestivals = async (userId) => {
  const festivals = await Festival.find({ userId });

  return festivals;
};

export const createNewFestival = async (userId, {
  title,
  venue,
  startDate,
  endDate,
}) => {
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error("Festival start date must be before end date");
  }

  const festival = await Festival.create({
    userId,
    title,
    venue,
    startDate,
    endDate,
  });

  return festival;
};

// Only finds festivals owned by the given user, so other users'
// festivals are reported as not found
export const getFestivalById = async (festivalId, userId) => {
  const festival = await Festival.findOne({ _id: festivalId, userId });

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
  userId,
  festivalData
) => {
  const festival = await getFestivalById(festivalId, userId);

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
    "venue",
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

export const deleteFestivalById = async (festivalId, userId) => {
  const festival = await getFestivalById(festivalId, userId);

  await Tournament.deleteMany({ festivalId });

  await festival.deleteOne();
};