import { test, expect } from "@playwright/test";

test("standard user can log in and open inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText("Products", { exact: true })).toBeVisible();
});
