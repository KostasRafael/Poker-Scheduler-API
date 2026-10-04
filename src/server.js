import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import authRouter from "./routes/auth.routes.js";
import festivalsRouter from "./routes/festivals.routes.js";
import tournamentsRouter from "./routes/tournaments.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import cors from "cors";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is required");
  process.exit(1);
}

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
origin: process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().replace(/\/$/, ""))
  : 'http://localhost:5173',
credentials: true
}));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/festivals", festivalsRouter);
app.use("/api/v1", tournamentsRouter);

app.use(errorHandler);

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
