import { auth } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default async function signUp({ email, password }: { email: string; password: string }) {
  let user = null;
  const error = null;
  let result = "";

  try {
    user = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(user.user, {
      url: `${window.location.origin}/signin`,
    });
    result = "Verification email sent. Please check your inbox.";
  } catch (err) {
    if (err instanceof FirebaseError) {
      return { user: null, error: err.code };
    }
  }

  return { result, error };
}
