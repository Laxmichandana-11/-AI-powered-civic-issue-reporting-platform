
import api from "./axios";

export const loginRequest = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const registerRequest = (name, email, password) => {
  return api.post("/auth/register", { name, email, password });
};

