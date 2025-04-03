import express from "express";
import {
  createPayment,
  createTransaction,
  listTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();
router.post("/payments", createPayment);
router.post("/", createTransaction);
router.get("/", listTransaction);

export default router;
