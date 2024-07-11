import express from "express";
import http from "http";
import App from "@src/express/appService";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || process.env.SERVER_PORT;

const StartServer = async () => {
  const app = express();

  await App(app);

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

StartServer.call("Server is CALLED!");