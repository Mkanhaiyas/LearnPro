import Razorpay from "razorpay";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import Transaction from "../models/transactionModel.js";
import UserCourseProgress from "../models/userCourseProgressModel.js";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPayment = async (req, res) => {
  const price = req.body;
  console.log(price.amount);
  try {
    const order = await razorpay.orders.create({
      amount: parseInt(price.amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return res.status(200).json({ message: "Ordered Successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Payment Failed", error });
  }
};

export const createTransaction = async (req, res) => {
  const { userId, courseId, transactionId, amount, paymentProvider } = req.body;

  try {
    // Fetch the course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(400).json({ message: "Invalid Course" });
    }

    // Create a new transaction
    const newTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });
    await newTransaction.save();

    // Initialize progress for the user
    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: course.sections.map((section) => ({
        sectionId: section.sectionId,
        chapters: section.chapters.map((chapter) => ({
          chapterId: chapter.chapterId,
          completed: false,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });
    await initialProgress.save();

    // Update course enrollments
    await Course.updateOne(
      { courseId },
      {
        $addToSet: {
          enrollments: { userId },
        },
      }
    );

    // Send success response
    res.status(200).json({
      message: "Purchased Course successfully",
      data: { transaction: newTransaction, courseProgress: initialProgress },
    });
  } catch (error) {
    console.error("Error creating transaction:", error); // Log for debugging
    res
      .status(500)
      .json({ message: "Failed to create Transaction and Enrollment", error });
  }
};

export const listTransaction = async (req, res) => {
  const { userId } = req.query;

  try {
    const transactions = userId
      ? await Transaction.find({ userId }).exec()
      : await Transaction.find().exec();

    res.json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
};
