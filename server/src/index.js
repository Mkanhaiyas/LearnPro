import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Connection from "./database/conn.js";
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";
// Import Routes
import courseRoutes from "./routes/courseRoutes.js";
import userClerkRoutes from "./routes/userClerkRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes.js";

// Configuration
dotenv.config();
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.use("/courses", courseRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users/course-progress", userCourseProgressRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Database Connection
Connection();

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
