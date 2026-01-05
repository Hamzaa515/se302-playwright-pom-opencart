import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test('Smoke-05: Checkout page is reachable from cart after adding an item', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();
  await results.openResultByIndex(0);

  await product.assertOpened();
  await product.addToCart();
  await product.openCartFromSuccessAlert();

  await cart.assertOpened();
  await cart.assertHasItems();
  await cart.proceedToCheckout();

  await checkout.assertOpened();
});
