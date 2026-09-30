import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userdb, msgdb } from "./schema.ts";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./middleware.ts";

dotenv.config();

const requiredEnvVars = ['CLIENT_URL', 'JWT_SECRET', 'MONGO_URL'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

const corsOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  }),
);

console.log(`✅ CORS enabled for: ${corsOrigin}`);

const JWT_SECRET = process.env.JWT_SECRET!;

mongoose.connect(process.env.MONGO_URL!).catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

function isValidUsername(username: unknown): username is string {
  return typeof username === "string" && /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8;
}

app.post("/signup", async (req, res) => {
  const { username, password, fullname } = req.body;

  if (!isValidUsername(username)) {
    return res.status(400).json({
      message: "Username must be 3-20 characters (letters, numbers, underscore only)",
    });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (typeof fullname !== "string" || fullname.trim().length === 0) {
    return res.status(400).json({ message: "Full name is required" });
  }

  const hashedpass = await bcrypt.hash(password, 10);
  try {
    const user = await userdb.create({ fullname, username, hashedpass });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    return res.status(400).json({ message: "This username is already taken" });
  }
});
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let user;
  try {
    user = await userdb.findOne({ username: username });
  } catch (err) {
    return res.status(500).json({ message: "database not responding, try again" });
  }

  if (user && user.hashedpass) {
    const checkpass = await bcrypt.compare(password, user.hashedpass);
    if (checkpass) {
      const token = jwt.sign({ userId: user!.id }, JWT_SECRET);
      res.status(201).json({ token });
    } else res.status(401).json({ message: "Wrong password" });
  } else {
    res.status(404).json({ message: "Username not found. New user? Create new acc" });
  }
});

app.get("/users", auth, async (req, res) => {
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
