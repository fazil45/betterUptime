import axios from "axios";
import { describe, expect, it, test } from "vitest";

const randomEmail = Math.random() * 10000;

describe("Signup endpoints", () => {
  it("Isn't able to signup if body is incorrect", async () => {
    try {
      await axios.post("http://localhost:3000/user/signup", {
        email: randomEmail,
        password: "password",
      });
      expect(false, "Control shouldn't reach here");
    } catch (e) {
    //   console.log(e);
    }
  });

  it("Is able to signup if body is incorrect", async () => {
    try {
      const res = await axios.post("http://localhost:3000/user/signup", {
        email: randomEmail,
        password: "password",
      });
      expect(res.status).toBe(200);
      expect(res.data.id).toBeDefined();
    } catch (e) {
    //   console.log(e);
    }
  });
});

describe("Signin endpoints", () => {
  it("Isn't able to signin if body is incorrect", async () => {
    try {
      await axios.post("http://localhost:3000/user/signup", {
        email: randomEmail,
        password: "password",
      });
      expect(false, "Control shouldn't reach here");
    } catch (e) {
    //   console.log(e);
    }
  });

  it("Is able to signin if body is incorrect", async () => {
    try {
      const res = await axios.post("http://localhost:3000/user/signup", {
        email: randomEmail,
        password: "password",
      });
      expect(res.status).toBe(200);
      const setCookieHeader = res.headers["set-cookie"];
      expect(setCookieHeader).toBeDefined();
    } catch (e) {
    //   console.log(e);
    }
  });
});
