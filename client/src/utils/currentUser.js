import AuthService from "./Auth";

export const getCurrentUser = () => {
  if (AuthService.loggedIn()) {
    return AuthService.getProfile();
  }
  return null;
};
