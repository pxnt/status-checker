import http from "http";
import { Server } from "socket.io";
import bootApp from "./boot/app.js";
import bootResources from "./boot/resources.js";
import bootSockets from "./boot/sockets.js";
import config from "./config/index.js";
import container from "./container.js";

function bootSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Configure based on your frontend URL in production
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  bootSockets(io);

  container.add('io', io);
}

async function init() {
  const resources = await bootResources();
  const app = bootApp();

  const server = http.createServer(app);

  bootSocketServer(server);

  server.keepAliveTimeout = 60 * 1000;

  server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Socket.IO server initialized`);
  });
}

init()
  .catch(err => {
    console.log(err);
  });