import express, { type Express } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { connectDatabase } from "./infrastructure/database";
import router from "./interface/routes";
import errorMiddleware from "./interface/middlewares/error.middleware";

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  connectDatabase();
  console.log(`Server is running on port ${PORT}`);
});
