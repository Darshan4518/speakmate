import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

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

    res.json({ message: response.text() });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
