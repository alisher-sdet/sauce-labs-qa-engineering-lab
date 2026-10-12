import { test, expect } from "@playwright/test";

test("products can be sorted by price from low to high", async ({ page }) => {
        await page.goto("https://www.saucedemo.com/");

        await page.getByTestId("username").fill("standard_user");
        await page.getByTestId("password").fill("secret_sauce");
        await page.getByTestId("login-button").click();

        await expect(page).toHaveURL(/inventory\.html/);

        await page.getByTestId("product-sort-container").selectOption("lohi");

        const priceElements = page.locator(".inventory_item_price");
        const prices = await priceElements.allTextContents();

        const numericPrices = prices.map((price) =>
                Number(price.replace("$", "")),
        );

        expect(numericPrices.length).toBeGreaterThan(0);
        expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
});
