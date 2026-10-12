import { test, expect } from "@playwright/test";

test("httpbin returns requested query parameters", async ({ request }) => {
  const response = await request.get("http://127.0.0.1:8080/get?source=smoke");

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.args).toEqual({
    source: "smoke",
  });
});
