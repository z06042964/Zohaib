const ERROR_MESSAGES = {
  "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
  "auth/invalid-credential": "Invalid email or password. Please try again.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-password": "Please enter your password.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment before trying again.",
  "auth/weak-password": "Password should be at least 6 characters long.",
};

export function getFirebaseAuthMessage(error) {
  return ERROR_MESSAGES[error?.code] || "Something went wrong. Please try again.";
}
