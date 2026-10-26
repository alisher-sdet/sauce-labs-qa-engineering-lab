import type { Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.finishButton = page.getByTestId("finish");
    this.backToProductsButton = page.getByTestId("back-to-products");
  }

  async fillCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async fillFirstNameAndPostalCode(
    firstName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.postalCodeInput.fill(postalCode);
  }

  async fillFirstNameAndLastName(
    firstName: string,
    lastName: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
