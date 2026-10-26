import { test, expect } from "@playwright/test";
import { InventoryPage } from "../../pages/InventoryPage.js";
import { loginAsStandardUser } from "./helpers/auth.js";

function parsePrices(prices: string[]): number[] {
  return prices.map((price) => {
    const numericPrice = Number(price.replace("$", ""));

    expect(
      Number.isFinite(numericPrice),
      `Invalid product price: "${price}"`,
    ).toBe(true);

    return numericPrice;
  });
}

test("products can be sorted by price from low to high", async ({ page }) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);

  await inventory.sortBy("lohi");

  const prices = await inventory.getProductPrices();
  expect(prices.length).toBeGreaterThan(0);

  const numericPrices = parsePrices(prices);

  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
});

test("products can be sorted by price from high to low", async ({ page }) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);

  await inventory.sortBy("hilo");

  const prices = await inventory.getProductPrices();
  expect(prices.length).toBeGreaterThan(0);

  const numericPrices = parsePrices(prices);

  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => b - a));
});

test("products can be sorted by name from A to Z", async ({ page }) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);

  await inventory.sortBy("az");

  const productNames = await inventory.getProductNames();
  expect(productNames.length).toBeGreaterThan(0);
  expect(productNames.every((name) => name.length > 0)).toBe(true);

  expect(productNames).toEqual(
    [...productNames].sort((a, b) => a.localeCompare(b)),
  );
});

test("products can be sorted by name from Z to A", async ({ page }) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);

  await inventory.sortBy("za");

  const productNames = await inventory.getProductNames();
  expect(productNames.length).toBeGreaterThan(0);
  expect(productNames.every((name) => name.length > 0)).toBe(true);

  expect(productNames).toEqual(
    [...productNames].sort((a, b) => b.localeCompare(a)),
  );
});
