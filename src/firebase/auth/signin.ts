import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function signIn({ email, password }: { email: string; password: string }) {
    let user = null
    let error = null;

    try {
         user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing in:", error);
        error = error;
    }

    return { user, error };
}
