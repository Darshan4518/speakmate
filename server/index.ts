import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

app.post("/chat", async (req: Request, res: Response): Promise<any> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format." });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a chat instance
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a friendly English teacher. Correct any grammar or vocabulary mistakes in the user's messages and provide explanations.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand. I'll act as a friendly English teacher, helping to correct grammar and vocabulary mistakes while providing clear explanations.",
            },
          ],
        },
      ],
    });

    // Generate response
    const result = await chat.sendMessage([{ text: message }]);
    const response = await result.response;

    res.status(200).json({ message: response.text() });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    return;
  });
});

// Graceful shutdown
const PORT = process.env.PORT || 3000;
const serverInstance = server.listen(PORT);

process.on("SIGTERM", () => {
  serverInstance.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  serverInstance.close(() => {
    process.exit(0);
  });
});
