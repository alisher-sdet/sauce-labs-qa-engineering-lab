from screens.products_screen import ProductsScreen


class TestProductsScreen:

    def test_products_screen_title_is_displayed(self, driver):
        products_screen = ProductsScreen(driver)
        products_title = products_screen.get_title()

        assert products_title.is_displayed()
        assert products_title.text == "Products"

    def test_products_list_is_not_empty(self, driver):
        products_screen = ProductsScreen(driver)
        product_titles = products_screen.get_product_titles()

        assert any(title.is_displayed() for title in product_titles)
