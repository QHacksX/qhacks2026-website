const authErrorMessages: { [key: string]: string } = {
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use":
    "This email is already in use by another account.",
  "auth/invalid-email": "The email address is badly formatted.",
  "auth/user-disabled": "This user has been disabled. Please contact support.",
  "auth/operation-not-allowed":
    "This operation is not allowed. Please contact support.",
  "auth/weak-password":
    "The password is too weak. Please choose a stronger password.",
  "auth/requires-recent-login": "Please re-login and try again.",
  "auth/too-many-requests": "Too many requests. Please try again later.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
  "auth/credential-already-in-use":
    "This credential is already associated with a different user account.",
  "auth/popup-blocked":
    "The popup was blocked by the browser. Please allow popups and try again.",
  "auth/popup-closed-by-user":
    "The popup was closed before completing the sign in. Please try again.",
  "auth/unauthorized-domain":
    "This domain is not authorized for OAuth operations.",
  "auth/invalid-action-code":
    "The action code is invalid or expired. Please try again.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email address but different sign-in credentials.",
  "auth/invalid-credential":
    "The provided credential is malformed or has expired.",
  "auth/missing-email": "An email address must be provided.",
  "auth/invalid-verification-code": "The verification code is invalid.",
  "auth/invalid-verification-id": "The verification ID is invalid.",
  "not-verified": "Please verify your email before logging in, a new verification email has been sent.",
  "password reset error": "Enter the email linked to your account"
};

export function getAuthErrorMessage(errorCode: string): string {
  return (
    authErrorMessages[errorCode] ||
    "An unknown error occurred. Please try again."
  );
}