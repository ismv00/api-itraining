import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

export const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://itraining.com.br",
      "https://www.itraining.com.br",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use(routes);
app.use(errorHandler);
