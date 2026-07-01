import axios from "axios";
import { BASE_URL } from "./config";

export const randomUser = async () => {
  const email = `test-${Date.now()}-${Math.random().toString(36).slice(2)}@gmail.com`;
  const password = "test@1234";

  await axios.post(`${BASE_URL}/user/signup`, { email, password });

  const res = await axios.post(`${BASE_URL}/user/signin`, { email, password });

  const setCookieHeader = res.headers["set-cookie"];
  return setCookieHeader![0]!;
};