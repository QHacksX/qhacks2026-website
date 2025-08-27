import { auth } from "@/firebase/config";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function signUp({ email, password }: { email: string; password: string }) {
    let user = null;
    let error = null;

    try {
        user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        if (err instanceof FirebaseError){
            return { user: null, error: err.code }
        }
    }

    return { user, error };
}