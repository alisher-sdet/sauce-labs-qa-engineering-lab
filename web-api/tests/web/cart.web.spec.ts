import { test, expect } from "@playwright/test";
import { loginAsStandardUser } from "./helpers/auth.js";

test("user can add a product to the cart", async ({ page }) => {
  await loginAsStandardUser(page);

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
  await loginAsStandardUser(page);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item")).toHaveCount(1);

  await page.getByTestId("remove-sauce-labs-backpack").click();

  await expect(page.locator(".cart_item")).toHaveCount(0);
  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});

test("user can continue shopping without losing cart items", async ({
  page,
}) => {
  await loginAsStandardUser(page);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.getByTestId("shopping-cart-link").click();
  await expect(page).toHaveURL(/cart\.html/);

  await page.getByTestId("continue-shopping").click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText(
    "Sauce Labs Backpack",
  );
  await expect(page.locator(".cart_quantity")).toHaveText("1");
});

test("cart supports multiple products and removing one item", async ({
  page,
}) => {
  await loginAsStandardUser(page);

  // Add two different products
  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  // Verify both products in the cart
  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item")).toHaveCount(2);
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);

  // Remove one product
  await page.getByTestId("remove-sauce-labs-backpack").click();

  await expect(page.locator(".cart_item")).toHaveCount(1);
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText(
    "Sauce Labs Bike Light",
  );
  await expect(page.locator(".cart_quantity")).toHaveText("1");
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
