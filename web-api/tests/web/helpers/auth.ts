import { expect, type Page } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage.js";

export async function loginAsStandardUser(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL(/inventory\.html/);
}
