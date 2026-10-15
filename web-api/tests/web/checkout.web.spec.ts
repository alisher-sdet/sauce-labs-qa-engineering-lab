import { test, expect } from "@playwright/test";

test("user can complete a checkout", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // Login
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  // Add a product and open the cart
  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item")).toHaveCount(1);

  // Start checkout
  await page.getByTestId("checkout").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // Enter customer information
  await page.getByTestId("firstName").fill("Alex");
  await page.getByTestId("lastName").fill("Tester");
  await page.getByTestId("postalCode").fill("10001");
  await page.getByTestId("continue").click();

  // Verify order overview
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText(
    "Sauce Labs Backpack",
  );
  await expect(page.locator(".summary_subtotal_label")).toHaveText(
    "Item total: $29.99",
  );
  await expect(page.locator(".summary_total_label")).toContainText("Total:");

  // Finish checkout
  await page.getByTestId("finish").click();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
});

test("checkout requires customer information", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("shopping-cart-link").click();
  await page.getByTestId("checkout").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // Continue without entering customer information
  await page.getByTestId("continue").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Error: First Name is required",
  );
});

test("checkout requires a last name", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("shopping-cart-link").click();
  await page.getByTestId("checkout").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await page.getByTestId("firstName").fill("Alex");
  await page.getByTestId("postalCode").fill("10001");
  await page.getByTestId("continue").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Error: Last Name is required",
  );
});

test("checkout requires a postal code", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("shopping-cart-link").click();
  await page.getByTestId("checkout").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await page.getByTestId("firstName").fill("Alex");
  await page.getByTestId("lastName").fill("Tester");
  await page.getByTestId("continue").click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Error: Postal Code is required",
  );
});
