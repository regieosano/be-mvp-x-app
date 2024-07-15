import express from "express";
import http from "http";
import App from "@src/express/appService";
import dotenv from "dotenv";
import { connectToDB } from "@src//db/connection";
import { SERVER_RUNNING_MESSAGE, DB_IS_TOCONNECT } from "@src/values/constants";

dotenv.config();

const StartServer = async (server_status_message: string) => {
  const PORT = process.env.PORT || process.env.SERVER_PORT;
  const app = express();

  const serverApp = await App(app);

  try {
    connectToDB(DB_IS_TOCONNECT);
  } catch (error: any) {
    throw new Error(error);
  }

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`${server_status_message} ${PORT}`);
  });

  return serverApp;
};

const runningServer = StartServer(SERVER_RUNNING_MESSAGE);

runningServer
  .then(() => {
    console.log("\n");
    console.log("System status...");
  })
  .catch(err => {
    console.log(err);
  });

process.on("uncaughtException", function (error) {
  console.error(
    new Date().toUTCString() + " uncaughtException:",
    error.message,
  );
  console.error(error.stack);
  process.exit(1);
});
