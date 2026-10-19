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

    def get_all_product_names(self) -> list[str]:
        names = []
        seen = set()

        def scroll_list(direction: str) -> bool:
            scroll_view = self.wait.until(
                lambda driver: driver.find_element(*self.SCROLL_VIEW)
            )

            return self.driver.execute_script(
                "mobile: scrollGesture",
                {
                    "elementId": scroll_view.id,
                    "direction": direction,
                    "percent": 0.5,
                },
            )

        # Сначала возвращаем каталог в начало.
        while scroll_list("up"):
            pass

        while True:
            for title in self.driver.find_elements(*self.PRODUCT_TITLES):
                name = title.text.strip()
                if name and name not in seen:
                    names.append(name)
                    seen.add(name)

            if not scroll_list("down"):
                break

        return names

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
        products: dict[str, float] = {}

        def scroll_list(direction: str) -> bool:
            scroll_view = self.wait.until(
                lambda driver: driver.find_element(*self.SCROLL_VIEW)
            )

            return self.driver.execute_script(
                "mobile: scrollGesture",
                {
                    "elementId": scroll_view.id,
                    "direction": direction,
                    "percent": 0.5,
                },
            )

        # Возвращаем список в начало.
        while scroll_list("up"):
            pass

        while True:
            cards = self.driver.find_elements(
                AppiumBy.XPATH,
                "//*[@resource-id='com.saucelabs.mydemoapp.android:id/productRV']"
                "/android.view.ViewGroup",
            )

            for card in cards:
                titles = card.find_elements(*self.PRODUCT_TITLES)
                prices = card.find_elements(*self.PRODUCT_PRICES)

                if not titles or not prices:
                    continue

                name = titles[0].text.strip()
                price_text = prices[0].text.strip().replace("$", "").replace(",", "")

                if name and price_text:
                    products[name] = float(price_text)

            if not scroll_list("down"):
                break

        return list(products.items())
