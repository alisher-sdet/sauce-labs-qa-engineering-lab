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
