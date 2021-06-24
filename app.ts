import express from "express";
import cors from "cors";
import httpStatus from "http-status";
import routes from "./routes";
import ApiError from "./utils/ApiError";
import bodyParser from "body-parser";

import * as http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { socketClient } from "./controllers/client.controller";

const xss = require("xss-clean");
var cookieParser = require("cookie-parser");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xss());
app.use(cookieParser());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.get("/", (_req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.use("/api", routes);

io.on(
  "connection",
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    console.log("client connected");
    socket.on("disconnect", () => {
      io.emit("client disconnected");
    });

    socketClient(io, socket);
  }
);
app.set("socketIo", io);
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  }
);

server.listen(process.env.PORT || 8899, () => {
  console.log(`Listening to port ${process.env.PORT || 8899}`);
});

export { io };
