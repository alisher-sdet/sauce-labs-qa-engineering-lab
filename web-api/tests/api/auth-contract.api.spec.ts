import { createServer, type Server } from "node:http";
import { once } from "node:events";
import { test, expect } from "@playwright/test";

const validApiKey = "valid-test-key";

let server: Server;
let baseURL: string;

test.beforeAll(async () => {
  server = createServer((req, res) => {
    if (req.headers["x-api-key"] !== validApiKey) {
      res.writeHead(403, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "invalid_api_key" }));
      return;
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ data: { authorized: true } }));
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine the mock server address");
  }

  baseURL = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  if (server?.listening) {
    server.close();
    await once(server, "close");
  }
});

test("auth contract accepts a valid API key", async ({ request }) => {
  const response = await request.get(`${baseURL}/protected`, {
    headers: { "x-api-key": validApiKey },
  });

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({
    data: { authorized: true },
  });
});

test("auth contract rejects an invalid API key", async ({ request }) => {
  const response = await request.get(`${baseURL}/protected`, {
    headers: { "x-api-key": "invalid-test-key" },
  });

  expect(response.status()).toBe(403);
  await expect(response.json()).resolves.toMatchObject({
    error: "invalid_api_key",
  });
});
