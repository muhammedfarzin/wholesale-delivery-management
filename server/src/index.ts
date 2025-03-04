import express, { type Express } from "express";
import { connectDatabase } from "./infastructure/database";
import router from "./interface/routes";

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  connectDatabase();
  console.log(`Server is running on port ${PORT}`);
});
