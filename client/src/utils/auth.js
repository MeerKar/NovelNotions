// src/utils/AuthService.js

import decode from "jwt-decode";

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? decode(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error("Token validation error:", err);
      return true;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    console.log("Storing token:", idToken);
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new AuthService();
