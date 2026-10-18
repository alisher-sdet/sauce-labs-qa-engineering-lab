import os

import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options

APPIUM_URL = os.getenv("APPIUM_URL", "http://127.0.0.1:4723")
APP_PACKAGE = "com.saucelabs.mydemoapp.android"


@pytest.fixture
def driver():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.automation_name = "UiAutomator2"

    options.set_capability("uiautomator2ServerInstallTimeout", 180000)
    options.set_capability("uiautomator2ServerLaunchTimeout", 120000)

    options.app_package = APP_PACKAGE
    options.app_activity = ".view.activities.SplashActivity"
    options.no_reset = False
    options.dont_stop_app_on_reset = False
    options.force_app_launch = True

    udid = os.getenv("ANDROID_UDID")
    if udid:
        options.udid = udid

    appium_driver = webdriver.Remote(APPIUM_URL, options=options)
    try:
        yield appium_driver
    finally:
        appium_driver.quit()
