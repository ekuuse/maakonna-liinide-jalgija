import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import busRouter from "./routes/bus";
import models from "./models";
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/bus", busRouter);

async function initDB() {
  try {
    await models.sequelize.authenticate();
    console.log("db connected");

    await models.sequelize.sync({ alter: true });
    console.log("tables synced");

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("db not connected:", err.message);
    } else {
      console.error("db not connected:", err);
    }
  }
}

initDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));