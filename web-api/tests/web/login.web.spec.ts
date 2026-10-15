import { test, expect } from "@playwright/test";

test("standard user can log in and open inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText("Products", { exact: true })).toBeVisible();
});

test("standard user cannot log in with an incorrect password", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("wrong_password");
  await page.getByTestId("login-button").click();

  const errorMessage = page.getByTestId("error");

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    "Epic sadface: Username and password do not match any user in this service",
  );

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

test("locked-out user cannot log in", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("locked_out_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  const errorMessage = page.getByTestId("error");

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out.",
  );

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});
