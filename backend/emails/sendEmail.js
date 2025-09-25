import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Check if Resend API key is configured
if (!process.env.RESEND_API_KEY) {
  console.warn(
    "Warning: RESEND_API_KEY not found in environment variables. Email functionality will be disabled."
  );
}

export const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sender = {
  email: process.env.EMAIL_FROM || "noreply@example.com",
  name: process.env.EMAIL_FROM_NAME || "Chatty App",
};
