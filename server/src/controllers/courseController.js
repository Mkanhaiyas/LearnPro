import Course from "../models/courseModel.js";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";

export const listCourses = async (req, res) => {
  const { category } = req.query;
  try {
    const courses =
      category && category !== "all"
        ? await Course.find({ category }).exec()
        : await Course.find().exec();
    res.json({ message: "Courses retrieved successfully", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

export const getCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findOne({ courseId });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json({ message: "Courses retrieved successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

export const createCourse = async (req, res) => {
  const { teacherId, teacherName } = req.body;
  try {
    if (!teacherId || !teacherName) {
      res.status(400).json({ message: "Teacher Id and name are required" });
      return;
    }
    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
    });
    await newCourse.save();
    res.json({ message: "Courses created successfully", data: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating courses", error });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  try {
    console.log("Kanhaiya", updateData);
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacherId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this course" });
    }

    if (updateData.price) {
      const price = parseInt(updateData.price, 10);
      if (isNaN(price)) {
        return res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number",
        });
      }
      updateData.price = price * 100;
    }

    if (updateData.sections) {
      try {
        const sectionsData =
          typeof updateData.sections === "string"
            ? JSON.parse(updateData.sections)
            : updateData.sections;

        updateData.sections = sectionsData.map((section) => ({
          ...section,
          sectionId: section.sectionId || uuidv4(),
          chapters: section.chapters.map((chapter) => ({
            ...chapter,
            chapterId: chapter.chapterId || uuidv4(),
          })),
        }));
      } catch (error) {
        return res.status(400).json({
          message: "Invalid sections format",
          error: "Sections must be a valid JSON array",
        });
      }
    }

    if (updateData.courseImage) {
      console.log("Updating course image:", updateData.courseImage); // Debugging
      course.image = updateData.courseImage;
    }

    course.set(updateData);
    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error.message || error,
    });
  }
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = getAuth(req);

  try {
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacherId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
    }

    await Course.deleteOne({ courseId });
    res.status(204).json({ message: "Courses deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting courses", error });
  }
};
