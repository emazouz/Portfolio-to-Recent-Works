import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/prisma";
import authRoute from "./routes/authRouter";
import projectRoute from "./routes/projectRouter";
import blogRoute from "./routes/blogRouter";
import commentRoute from "./routes/commentRouter";
import templatesRoute from "./routes/templatesRouter";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/projects", projectRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/comments", commentRoute);
app.use("/api/templates", templatesRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Server is shutting down...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
