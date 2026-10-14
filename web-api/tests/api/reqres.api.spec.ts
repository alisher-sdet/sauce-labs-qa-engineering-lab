import { test, expect } from "@playwright/test";

test("ReqRes returns the requested user", async ({ request }) => {
  const apiKey = process.env.REQRES_API_KEY;

  expect(apiKey, "REQRES_API_KEY must be configured").toBeTruthy();

  const response = await request.get("https://reqres.in/api/users/2", {
    headers: {
      "x-api-key": apiKey!,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.data).toMatchObject({
    id: 2,
    email: "janet.weaver@reqres.in",
    first_name: "Janet",
    last_name: "Weaver",
  });
});
