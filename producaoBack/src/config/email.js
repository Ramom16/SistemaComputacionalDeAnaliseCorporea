import { config } from "dotenv";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});