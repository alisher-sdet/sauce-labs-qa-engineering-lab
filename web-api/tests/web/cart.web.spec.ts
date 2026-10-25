import { test, expect } from "@playwright/test";
import { loginAsStandardUser } from "./helpers/auth.js";
import { InventoryPage } from "../../pages/InventoryPage.js";
import { CartPage } from "../../pages/CartPage.js";

test("user can add a product to the cart", async ({ page }) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addProduct("sauce-labs-backpack");

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await inventory.openCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cart.productNames).toHaveText("Sauce Labs Backpack");
  await expect(cart.quantities).toHaveText("1");
});

test("user can remove a product from the cart", async ({ page }) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addProduct("sauce-labs-backpack");
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await inventory.openCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cart.cartItems).toHaveCount(1);

  await cart.removeProduct("sauce-labs-backpack");

  await expect(cart.cartItems).toHaveCount(0);
  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
});

test("user can continue shopping without losing cart items", async ({
  page,
}) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addProduct("sauce-labs-backpack");
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await inventory.openCart();
  await expect(page).toHaveURL(/cart\.html/);

  await cart.continueShopping();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await inventory.openCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cart.productNames).toHaveText("Sauce Labs Backpack");
  await expect(cart.quantities).toHaveText("1");
});

test("cart supports multiple products and removing one item", async ({
  page,
}) => {
  await loginAsStandardUser(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  // Add two different products
  await inventory.addProduct("sauce-labs-backpack");
  await inventory.addProduct("sauce-labs-bike-light");

  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  // Verify both products in the cart
  await inventory.openCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cart.cartItems).toHaveCount(2);
  await expect(cart.productNames).toHaveText([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);

  // Remove one product
  await cart.removeProduct("sauce-labs-backpack");

  await expect(cart.cartItems).toHaveCount(1);
  await expect(cart.productNames).toHaveText("Sauce Labs Bike Light");
  await expect(cart.quantities).toHaveText("1");
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
