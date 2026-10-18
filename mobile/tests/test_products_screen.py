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

    def test_products_catalog_contains_expected_products(self, driver):
        products_screen = ProductsScreen(driver)
        product_names = products_screen.get_all_product_names()

        expected_products = [
            "Sauce Labs Backpack",
            "Sauce Labs Backpack (green)",
            "Sauce Labs Backpack (orange)",
            "Sauce Labs Backpack (red)",
        ]

        assert product_names
        assert len(set(product_names)) == len(product_names)
        assert all(name in product_names for name in expected_products)

    def test_products_catalog_can_be_sorted_by_name_ascending(self, driver):
        products_screen = ProductsScreen(driver)

        products_screen.sort_by_name_ascending()
        product_names = products_screen.get_all_product_names()

        assert product_names
        assert product_names == sorted(product_names, key=str.casefold)

    def test_products_catalog_can_be_sorted_by_name_descending(self, driver):
        products_screen = ProductsScreen(driver)

        products_screen.sort_by_name_descending()
        product_names = products_screen.get_all_product_names()

        assert product_names
        assert product_names == sorted(
            product_names,
            key=str.casefold,
            reverse=True,
        )
