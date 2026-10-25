import type { Locator, Page } from "@playwright/test";

export class InventoryPage {
  readonly sortSelect: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.sortSelect = page.getByTestId("product-sort-container");
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return (await this.productNames.allTextContents()).map((name) =>
      name.trim(),
    );
  }

  async getProductPrices(): Promise<string[]> {
    return (await this.productPrices.allTextContents()).map((price) =>
      price.trim(),
    );
  }
}
