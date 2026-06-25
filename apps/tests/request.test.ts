import { describe, expect, it } from "vitest";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

describe("Website gets created", () => {

  it("Website is not created if url is not present", async () => {});

  it("Website is created if url is present", async () => {
    const response = await axios.post(`${BASE_URL}/website`, {
      url: "https://google.com",
    });

    expect(response.data.id).not.toBeNull();
  });
});
