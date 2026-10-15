import { expect, type Page } from "@playwright/test";

export async function loginAsStandardUser(page: Page): Promise<void> {
  await page.goto("https://www.saucedemo.com/");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/inventory\.html/);
}
