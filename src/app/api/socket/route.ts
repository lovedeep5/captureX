import { WebSocketServer } from "ws";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "http";

let wss: WebSocketServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket?.server.wss) {
    console.log("Initializing WebSocket server...");

    const server: Server = res.socket.server as any;
    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
      console.log("New client connected");

      ws.on("message", (message) => {
        console.log("Received:", message.toString());

        // Broadcast the message to all clients
        wss?.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(`Echo: ${message.toString()}`);
          }
        });
      });

      ws.on("close", () => console.log("Client disconnected"));
    });

    res.socket.server.wss = wss;
  }

  res.end();
}
