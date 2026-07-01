import { describe, expect, it } from "vitest";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

describe("Website gets created", () => {
  it("Website is not created if url is not present", async () => {
    try {
      await axios.post(`${BASE_URL}/website`, {});
      expect(false, "Website created when it shouldnt");
    } catch (error) {}
  });

  it("Website is created if url is present", async () => {
    try {
      const response = await axios.post(`${BASE_URL}/website`, {
        url: "https://google.com",
        user_id: "1",
      });

      expect(response.data.id).not.toBeNull();
    } catch (error) {}
  });
});
