import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Chapter Progress Schema
const chapterProgressSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

// Section Progress Schema
const sectionProgressSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: [chapterProgressSchema],
});

// User Course Progress Schema
const userCourseProgressSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    enrollmentDate: {
      type: String,
      required: true,
    },
    overallProgress: {
      type: Number,
      required: true,
    },
    sections: [sectionProgressSchema],
    lastAccessedTimestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const UserCourseProgress = model(
  "UserCourseProgress",
  userCourseProgressSchema
);

export default UserCourseProgress;
