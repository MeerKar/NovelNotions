import Auth from "./auth";

export const getCurrentUser = () => {
  if (Auth.loggedIn()) {
    return Auth.getProfile();
  }
  return null;
};
