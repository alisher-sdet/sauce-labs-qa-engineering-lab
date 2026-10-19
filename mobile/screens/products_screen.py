from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait


class ProductsScreen:
    TITLE = (AppiumBy.ACCESSIBILITY_ID, "title")
    PRODUCT_TITLES = (
        AppiumBy.ID,
        "com.saucelabs.mydemoapp.android:id/titleTV",
    )
    PRODUCT_PRICES = (
        AppiumBy.ID,
        "com.saucelabs.mydemoapp.android:id/priceTV",
    )
    SCROLL_VIEW = (
        AppiumBy.ID,
        "com.saucelabs.mydemoapp.android:id/scrollView",
    )
    SORT_BUTTON = (AppiumBy.ID, "com.saucelabs.mydemoapp.android:id/sortIV")
    SORT_NAME_ASC = (AppiumBy.ID, "com.saucelabs.mydemoapp.android:id/nameAscCL")
    SORT_NAME_DESC = (AppiumBy.ID, "com.saucelabs.mydemoapp.android:id/nameDesCL")
    SORT_PRICE_ASC = (AppiumBy.ID, "com.saucelabs.mydemoapp.android:id/priceAscCL")
    SORT_PRICE_DESC = (AppiumBy.ID, "com.saucelabs.mydemoapp.android:id/priceDesCL")

    PRODUCT_CARDS = (
        AppiumBy.XPATH,
        "//*[@resource-id='com.saucelabs.mydemoapp.android:id/productRV']"
        "/android.view.ViewGroup",
    )

    def __init__(self, driver: WebDriver, timeout: int = 15):
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout)

    def get_title(self):
        return self.wait.until(lambda driver: driver.find_element(*self.TITLE))

    def get_product_titles(self):
        return self.wait.until(
            lambda driver: (
                elements
                if (elements := driver.find_elements(*self.PRODUCT_TITLES))
                else False
            )
        )

    def get_product_names(self) -> list[str]:
        return [title.text for title in self.get_product_titles()]

    def _scroll_list(self, direction: str, scroll_view_id: str | None = None) -> bool:
        if scroll_view_id is None:
            scroll_view = self.wait.until(
                lambda driver: driver.find_element(*self.SCROLL_VIEW)
            )
            scroll_view_id = scroll_view.id

        return self.driver.execute_script(
            "mobile: scrollGesture",
            {
                "elementId": scroll_view_id,
                "direction": direction,
                "percent": 0.5,
            },
        )

    def _collect_products(self, with_prices: bool = False) -> dict[str, float | None]:
        products: dict[str, float | None] = {}

        scroll_view = self.wait.until(
            lambda driver: driver.find_element(*self.SCROLL_VIEW)
        )
        scroll_view_id = scroll_view.id

        # Сначала возвращаем каталог в начало.
        while self._scroll_list("up", scroll_view_id):
            pass

        while True:
            if with_prices:
                cards = self.driver.find_elements(*self.PRODUCT_CARDS)

                for card in cards:
                    titles = card.find_elements(*self.PRODUCT_TITLES)
                    prices = card.find_elements(*self.PRODUCT_PRICES)

                    if not titles or not prices:
                        continue

                    name = titles[0].text.strip()
                    price_text = (
                        prices[0].text.strip().replace("$", "").replace(",", "")
                    )

                    if name and price_text:
                        products[name] = float(price_text)
            else:
                for title in self.driver.find_elements(*self.PRODUCT_TITLES):
                    name = title.text.strip()

                    if name:
                        products.setdefault(name, None)

            if not self._scroll_list("down", scroll_view_id):
                break

        return products

    def get_all_product_names(self) -> list[str]:
        return list(self._collect_products().keys())

    def open_sort_menu(self):
        self.wait.until(lambda driver: driver.find_element(*self.SORT_BUTTON)).click()

    def sort_by_name_ascending(self):
        self.open_sort_menu()
        self.wait.until(lambda driver: driver.find_element(*self.SORT_NAME_ASC)).click()

    def sort_by_name_descending(self):
        self.open_sort_menu()
        self.wait.until(
            lambda driver: driver.find_element(*self.SORT_NAME_DESC)
        ).click()

    def sort_by_price_ascending(self):
        self.open_sort_menu()
        self.wait.until(
            lambda driver: driver.find_element(*self.SORT_PRICE_ASC)
        ).click()

    def sort_by_price_descending(self):
        self.open_sort_menu()
        self.wait.until(
            lambda driver: driver.find_element(*self.SORT_PRICE_DESC)
        ).click()

    def get_all_products_with_prices(self) -> list[tuple[str, float]]:
        products = self._collect_products(with_prices=True)

        return [(name, price) for name, price in products.items() if price is not None]
