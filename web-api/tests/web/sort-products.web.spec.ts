import { test, expect } from "@playwright/test";

test("products can be sorted by price from low to high", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("product-sort-container").selectOption("lohi");

  const prices = await page.locator(".inventory_item_price").allTextContents();
  expect(prices.length).toBeGreaterThan(0);

  const numericPrices = prices.map((price) => {
    const normalizedPrice = price.trim().replace("$", "");
    const numericPrice = Number(normalizedPrice);

    expect(
      Number.isFinite(numericPrice),
      `Invalid product price: "${price}"`,
    ).toBe(true);

    return numericPrice;
  });

  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
});

test("products can be sorted by price from high to low", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("product-sort-container").selectOption("hilo");

  const prices = await page.locator(".inventory_item_price").allTextContents();
  expect(prices.length).toBeGreaterThan(0);

  const numericPrices = prices.map((price) => {
    const normalizedPrice = price.trim().replace("$", "");
    const numericPrice = Number(normalizedPrice);

    expect(
      Number.isFinite(numericPrice),
      `Invalid product price: "${price}"`,
    ).toBe(true);

    return numericPrice;
  });

  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => b - a));
});

test("products can be sorted by name from A to Z", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("product-sort-container").selectOption("az");

  const productNames = await page
    .locator(".inventory_item_name")
    .allTextContents();

  expect(productNames.length).toBeGreaterThan(0);

  const normalizedNames = productNames.map((name) => name.trim());

  expect(normalizedNames.every((name) => name.length > 0)).toBe(true);
  expect(normalizedNames).toEqual(
    [...normalizedNames].sort((a, b) => a.localeCompare(b)),
  );
});
