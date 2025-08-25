import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function signUp({ email, password }: { email: string; password: string }) {
    let user = null;
    let error = null;

    try {
        user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error("Error signing up:", err);
        error = err;
    }

    return { user, error };
}