import Course from "../models/courseModel.js";
import UserCourseProgress from "../models/userCourseProgressModel.js";
import { calculateOverallProgress, mergeSections } from "../utils/utils.js";

export const getUserEnrolledCourses = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrolledCourses = await UserCourseProgress.find({ userId });
    const courseIds = enrolledCourses.map((item) => item.courseId);
    const courses = await Course.find({ courseId: { $in: courseIds } });

    res.json({
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving enrolled courses",
      error: error.message,
    });
  }
};

export const getUserCourseProgress = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const progress = await UserCourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        message: "Course progress not found",
      });
    }

    res.json({
      message: "Course progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving course progress",
      error: error.message,
    });
  }
};

export const updateUserCourseProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  const progressData = req.body;
  console.log(userId, courseId, progressData);
  try {
    let progress = await UserCourseProgress.findOne({ userId, courseId });
    console.log(userId, courseId, progressData.sections);
    if (!progress) {
      console.log("Hello Not");
      progress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
      });
    } else {
      progress.sections = mergeSections(
        progress.sections,
        progressData.sections || []
      );
      (progress.lastAccessedTimestamp = new Date().toISOString()),
        (progress.overallProgress = calculateOverallProgress(
          progress.sections
        ));
    }

    await progress.save();

    res.json({
      message: "",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user course progress",
      error: error.message,
    });
  }
};
