import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userdb, msgdb } from "./schema.ts";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
const JWT_SECRET = process.env.JWT_SECRET!;
mongoose.connect(process.env.MONGO_URL!);

app.post("/signup", async (req, res) => {
  const { username, password, fullname } = req.body;

  const hashedpass = await bcrypt.hash(password, 10);
  try {
    const user = await userdb.create({ fullname, username, hashedpass });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    return res.json("This username is alredy taken");
  }
});
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  let user;
  try {
    user = await userdb.findOne({ username: username });
  } catch (err) {
    return res.json("database not responsding try again");
  }

  if (user && user.hashedpass) {
    const checkpass = await bcrypt.compare(password, user.hashedpass);
    if (checkpass) {
      const token = jwt.sign({ userId: user!.id }, JWT_SECRET);
      res.status(201).json({ token });
    } else res.json("Wrong password");
  } else {
    res.json("Username not found. New user? Create new acc");
  }
});

app.get("/users", async (req, res) => {
  const search = req.query.search;

  if (typeof search !== "string")
    return res.status(400).json({ message: "invalid search" });

  const results = await userdb.find({
    username: { $regex: search, $options: "i" },
  });
  res.json(results);
});

interface customsocket extends WebSocket {
  user?: string;
  isAuth?: boolean;
}

const socketlist = new Map<string, Set<WebSocket>>();
wss.on("connection", (ws: customsocket) => {
  ws.isAuth = false;

  ws.on("message", async (data) => {
    const msg = JSON.parse(data.toString());

    if (msg.type === "auth") {
      try {
        const decoded = jwt.verify(msg.token, JWT_SECRET) as { userId: string };

        const user = await userdb.findById(decoded.userId);

        if (!user) {
          ws.close();
          return;
        }

        ws.user = user.username!;
        ws.isAuth = true;

        const messages = await msgdb
          .find({
            $or: [{ sentBy: ws.user }, { sentTo: ws.user }],
          })
          .sort({ time: 1 });

        ws.send(
          JSON.stringify({
            type: "history",
            username: user.username,
            fullname: user.fullname,
            messages,
          }),
        );

        if (!socketlist.has(ws.user)) {
          socketlist.set(ws.user, new Set());
        }
        socketlist.get(ws.user)!.add(ws);
      } catch {
        ws.close();
      }
    }

    if (msg.type === "message") {
      if (ws.isAuth) {
        const { otherguy, text } = msg;

        const sendtodb = await msgdb.create({
          sentBy: ws.user,
          sentTo: otherguy,
          textContent: text,
          time: new Date(),
        });

        const targets = socketlist.get(otherguy);

        if (targets) {
          for (const sock of targets) {
            sock.send(
              JSON.stringify({
                type: "message",
                message: sendtodb,
              }),
            );
          }
        }

        ws.send(
          JSON.stringify({
            type: "message",
            message: sendtodb,
          }),
        );
      } else {
        ws.close();
        return;
      }
    }
  });

  ws.on("close", () => {
    if (!ws.user) return;
    const userSockets = socketlist.get(ws.user);
    if (userSockets) {
      userSockets.delete(ws);
      if (userSockets.size === 0) {
        socketlist.delete(ws.user);
      }
    }
  });
});

server.listen(process.env.PORT || 3100);
