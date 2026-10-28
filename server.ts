import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { attachRooms, onlineCounts } from "@/server/rooms";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    // Live room occupancy lives in this process (Socket.IO), so it's served here.
    if (req.url === "/api/rooms/online") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(onlineCounts()));
      return;
    }
    handle(req, res);
  });

  const io = new Server(httpServer, { path: "/socket.io" });
  attachRooms(io);

  httpServer.listen(port, () => {
    console.log(`> Tech Tie Toys em http://localhost:${port} (${dev ? "dev" : "produção"})`);
  });
});
