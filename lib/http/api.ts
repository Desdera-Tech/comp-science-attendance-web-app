import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  timeout: 120000,
  withCredentials: true, // send cookies to Next.js
});
