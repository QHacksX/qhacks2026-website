import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

export async function passwordReset({ email }: { email?: string }) {
  let result: string | undefined;
  let error: string | undefined;
  if (!email) {
    error = "auth/missing-email";
  } else {
    try {
      await sendPasswordResetEmail(auth, email);
      result = "Check your email for instructions to change your password";
    } catch (e) {
      result = undefined;
      error = "Something went wrong please try again";
    }
  }

  return { result, error };
}