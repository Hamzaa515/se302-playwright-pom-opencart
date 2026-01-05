import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('Smoke-04: Adding a product to cart produces success and cart contains items', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();
  await results.openResultByIndex(0);

  await product.assertOpened();
  await product.addToCart();
  await product.assertSuccessContains('shopping cart');

  await product.openCartFromSuccessAlert();

  await cart.assertOpened();
  await cart.assertHasItems();

  const count = await cart.getItemCount();
  expect(count).toBeGreaterThan(0);
});
