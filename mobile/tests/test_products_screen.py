import os

from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait

APPIUM_URL = os.getenv("APPIUM_URL", "http://127.0.0.1:4723")
APP_PACKAGE = "com.saucelabs.mydemoapp.android"


def test_products_screen_is_displayed():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.automation_name = "UiAutomator2"

    options.set_capability("uiautomator2ServerInstallTimeout", 180000)
    options.set_capability("uiautomator2ServerLaunchTimeout", 120000)

    options.app_package = APP_PACKAGE
    options.app_activity = ".view.activities.SplashActivity"
    options.no_reset = True
    options.dont_stop_app_on_reset = True
    options.force_app_launch = False

    udid = os.getenv("ANDROID_UDID")
    if udid:
        options.udid = udid

    driver = webdriver.Remote(APPIUM_URL, options=options)

    try:
        products_title = WebDriverWait(driver, 15).until(
            lambda d: d.find_element(AppiumBy.ACCESSIBILITY_ID, "title")
        )

        assert products_title.is_displayed()
        assert products_title.text == "Products"

        product_titles = WebDriverWait(driver, 15).until(
            lambda d: d.find_elements(
                AppiumBy.ID,
                f"{APP_PACKAGE}:id/titleTV",
            )
        )

        assert any(title.is_displayed() for title in product_titles)

    finally:
        driver.quit()
