import { test, expect } from "@playwright/test";
import { loginAsStandardUser } from "./helpers/auth.js";
import { addBackpackAndOpenCart } from "./helpers/cart.js";
import { CartPage } from "../../pages/CartPage.js";
import { InventoryPage } from "../../pages/InventoryPage.js";
import { CheckoutPage } from "../../pages/CheckoutPage.js";

test("user can complete a checkout", async ({ page }) => {
  await loginAsStandardUser(page);

  // Add a product and open the cart
  await addBackpackAndOpenCart(page);
  const checkout = new CheckoutPage(page);
  const cart = new CartPage(page);

  await expect(page.locator(".cart_item")).toHaveCount(1);

  // Start checkout
  await cart.checkout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // Enter customer information
  await checkout.fillCustomerInformation("Alex", "Tester", "10001");
  await checkout.continue();

  // Verify order overview
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText(
    "Sauce Labs Backpack",
  );
  await expect(page.locator(".summary_subtotal_label")).toHaveText(
    "Item total: $29.99",
  );
  await expect(page.locator(".summary_tax_label")).toHaveText("Tax: $2.40");
  await expect(page.locator(".summary_total_label")).toHaveText(
    "Total: $32.39",
  );

  // Finish checkout
  await checkout.finish();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
});

test("checkout requires customer information", async ({ page }) => {
  await loginAsStandardUser(page);

  await addBackpackAndOpenCart(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  await cart.checkout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // Continue without entering customer information
  await checkout.continue();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Error: First Name is required",
  );
});

test("checkout requires a last name", async ({ page }) => {
  await loginAsStandardUser(page);

  await addBackpackAndOpenCart(page);
  const cart = new CartPage(page);
  await cart.checkout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  const checkout = new CheckoutPage(page);
  await checkout.fillFirstNameAndPostalCode("Alex", "10001");
  await checkout.continue();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Error: Last Name is required",
  );
});

test("checkout requires a postal code", async ({ page }) => {
  await loginAsStandardUser(page);

  await addBackpackAndOpenCart(page);
  const checkout = new CheckoutPage(page);
  const cart = new CartPage(page);
  await cart.checkout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await checkout.fillFirstNameAndLastName("Alex", "Tester");
  await checkout.continue();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Error: Postal Code is required",
  );
});

test("cart is cleared after a successful checkout", async ({ page }) => {
  await loginAsStandardUser(page);

  await addBackpackAndOpenCart(page);
  const checkout = new CheckoutPage(page);
  const cart = new CartPage(page);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await cart.checkout();

  await checkout.fillCustomerInformation("Alex", "Tester", "10001");
  await checkout.continue();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await checkout.finish();

  await expect(page).toHaveURL(/checkout-complete\.html/);

  await checkout.backToProducts();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);

  await new InventoryPage(page).openCart();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator(".cart_item")).toHaveCount(0);
});
