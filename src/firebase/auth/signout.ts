import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

export async function signUserOut() {
  let result = null;
  let error = null;
  try {
    result = await signOut(auth);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
