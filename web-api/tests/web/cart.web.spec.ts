import { test, expect } from "@playwright/test";

test("user can add a product to the cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText(
    "Sauce Labs Backpack",
  );

  await expect(page.locator(".cart_quantity")).toHaveText("1");
});

test("user can remove a product from the cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item")).toHaveCount(1);

  await page.getByTestId("remove-sauce-labs-backpack").click();

  await expect(page.locator(".cart_item")).toHaveCount(0);
  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});
