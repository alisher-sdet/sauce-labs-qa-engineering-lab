import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly cartItems: Locator;
  readonly productNames: Locator;
  readonly quantities: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.cartItems = page.locator(".cart_item");
    this.productNames = page.locator(".cart_item .inventory_item_name");
    this.quantities = page.locator(".cart_quantity");
    this.checkoutButton = page.getByTestId("checkout");
    this.continueShoppingButton = page.getByTestId("continue-shopping");
  }

  async removeProduct(productId: string): Promise<void> {
    await this.cartItems.getByTestId(`remove-${productId}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
