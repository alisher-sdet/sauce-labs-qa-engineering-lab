import { expect, type Page } from "@playwright/test";
import { InventoryPage } from "../../../pages/InventoryPage.js";

export async function addBackpackAndOpenCart(page: Page): Promise<void> {
  const inventory = new InventoryPage(page);

  await inventory.addProduct("sauce-labs-backpack");
  await inventory.openCart();

  await expect(page).toHaveURL(/cart\.html/);
}
