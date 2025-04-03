import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import Transaction from "../models/transactionModel.js";
import UserCourseProgress from "../models/userCourseProgressModel.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    // Models and corresponding JSON files
    const modelsAndFiles = [
      { model: Course, file: "./data/courses.json" },
      { model: Transaction, file: "./data/transactions.json" },
      { model: UserCourseProgress, file: "./data/userCourseProgress.json" },
    ];

    for (const { model, file } of modelsAndFiles) {
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (!Array.isArray(data)) {
        console.error(`Invalid data format in ${filePath}. Expected an array.`);
        continue;
      }

      // Seed data
      console.log(`Seeding data for ${model.modelName}...`);
      await model.deleteMany(); // Clear existing data
      await model.insertMany(data); // Insert new data
      console.log(`Successfully seeded data for ${model.modelName}.`);
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

// Run the seed script if executed directly
if (process.argv[1] === __filename) {
  seed()
    .then(() => {
      console.log("Seeding complete. Closing MongoDB connection.");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Failed to run seed script:", err);
      mongoose.connection.close();
    });
}
