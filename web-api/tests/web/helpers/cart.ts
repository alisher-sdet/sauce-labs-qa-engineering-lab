import { expect, type Page } from "@playwright/test";

export async function addBackpackAndOpenCart(page: Page): Promise<void> {
  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await page.getByTestId("shopping-cart-link").click();

  await expect(page).toHaveURL(/cart\.html/);
}
