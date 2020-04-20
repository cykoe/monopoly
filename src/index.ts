/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
const http = require("http").Server(app);

// set up socket.io and bind it to our
// http server.
const io = require("socket.io")(http);

/**
 * Server Activation
 */
const server = http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static("./app/build"));

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
  console.log("a user connected");
  // whenever we receive a 'message' we log it out
  socket.on("message", function (message: any) {
    console.log(message);
  });
});

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
