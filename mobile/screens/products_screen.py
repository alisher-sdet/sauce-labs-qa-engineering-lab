from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait


class ProductsScreen:
    TITLE = (AppiumBy.ACCESSIBILITY_ID, "title")
    PRODUCT_TITLES = (AppiumBy.ID, "com.saucelabs.mydemoapp.android:id/titleTV")

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

        while True:
            for title in self.driver.find_elements(*self.PRODUCT_TITLES):
                name = title.text
                if name and name not in seen:
                    names.append(name)
                    seen.add(name)

            can_scroll_more = self.driver.execute_script(
                "mobile: scrollGesture",
                {
                    "left": 50,
                    "top": 200,
                    "width": self.driver.get_window_size()["width"] - 100,
                    "height": self.driver.get_window_size()["height"] - 300,
                    "direction": "down",
                    "percent": 0.75,
                },
            )

            if not can_scroll_more:
                break

        return names
