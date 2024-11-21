// src/utils/AuthService.js

import decode from "jwt-decode";

class AuthService {
  getProfile() {
    try {
      const token = this.getToken();
      if (!token) return null;
      return decode(token);
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        this.logout();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error checking token expiration:", err);
      this.logout();
      return true;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    // Optionally, redirect or perform other actions here
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.reload();
  }
}

export default new AuthService();
