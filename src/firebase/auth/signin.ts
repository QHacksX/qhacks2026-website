import { auth } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function signIn({ email, password }: { email: string; password: string }) {
    let user = null
    const error = null;

    try {
         user = await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        if (err instanceof FirebaseError){
            return { user: null, error: err.code }
        }
    }

    return { user, error };
}
