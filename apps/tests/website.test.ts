import { beforeAll, describe, expect, it } from "vitest";
import axios from "axios";
import { BASE_URL } from "./config";
import { randomUser } from "./testConfig";

describe("Website gets created", () => {
  let cookie: string;

  beforeAll(async () => {
    cookie = await randomUser();
  });

  it("Website is not created if url is not present and header is present", async () => {
    try {
      await axios.post(
        `${BASE_URL}/website/create`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        },
      );
      expect(false, "Website created when it shouldnt");
    } catch (error) {}
  });

  it("Website is created if header and  url is present", async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/website/create`,
        {
          url: "https://google.com",
          user_id: "1",
        },
        {
          headers: {
            Cookie: cookie,
          },
        },
      );

      expect(response.data.id).not.toBeNull();
    } catch (error) {}
  });

  it("Website is not created if header is not present", async () => {
    try {
      const response = await axios.post(`${BASE_URL}/website/create`, {
        url: "https://google.com",
        user_id: "1",
      });

      expect(false, "Website created when it shouldnt");
    } catch (error) {}
  });
});

describe("Can fetch Website", () => {
  let cookie1: string;
  let cookie2: string;

  beforeAll(async () => {
    cookie1 = await randomUser();
    cookie2 = await randomUser();
  });

  it("Is able to fetch a website that the user created", async () => {
    const websiteResponse = await axios.post(
      `${BASE_URL}/website/create`,
      { url: "https://google.com" },
      { headers: { Cookie: cookie1 } }
    );

    const getWebsite = await axios.get(
      `${BASE_URL}/website/status/${websiteResponse.data.id}`,
      { headers: { Cookie: cookie1 } }
    );

    expect(getWebsite.data.website.id).toBe(websiteResponse.data.id);
  });

  it("Can't access website created by other user", async () => {
    const websiteResponse = await axios.post(
      `${BASE_URL}/website/create`,
      { url: "https://google.com" },
      { headers: { Cookie: cookie1 } }
    );

    try {
      await axios.get(
        `${BASE_URL}/website/status/${websiteResponse.data.id}`,
        { headers: { Cookie: cookie2 } } // different user
      );
      expect.fail("Should not be able to access another user's website");
    } catch (error: any) {
      expect(error.response.status).toBe(409);
    }
  });
});