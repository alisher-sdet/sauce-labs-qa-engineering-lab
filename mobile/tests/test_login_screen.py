from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait

APPIUM_URL = "http://127.0.0.1:4723"
APP_PACKAGE = "com.swaglabsmobileapp"


def test_login_screen_is_displayed():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.automation_name = "UiAutomator2"
    options.udid = "emulator-5554"
    options.app_package = APP_PACKAGE
    options.app_activity = ".MainActivity"
    options.no_reset = True

    driver = webdriver.Remote(APPIUM_URL, options=options)

    try:
        username = WebDriverWait(driver, 15).until(
            lambda d: d.find_element(AppiumBy.ACCESSIBILITY_ID, "test-Username")
        )
        assert username.is_displayed()
    finally:
        driver.quit()
