import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";
import { loginAsStandardUser } from "./helpers/auth.js";

test("standard user can log in and open inventory", async ({ page }) => {
  await loginAsStandardUser(page);
  await expect(page.getByText("Products", { exact: true })).toBeVisible();
});

test("standard user cannot log in with an incorrect password", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "wrong_password");

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: Username and password do not match any user in this service",
  );

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

test("locked-out user cannot log in", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("locked_out_user", "secret_sauce");

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: Sorry, this user has been locked out.",
  );

  await expect(page).toHaveURL("https://www.saucedemo.com/");
});
