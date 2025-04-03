import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Database Connected Successfully");
    });
  } catch (error) {
    console.log(error);
  }
};

export default Connection;
