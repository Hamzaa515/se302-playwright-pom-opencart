import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('Functional-05: Add to cart with a chosen quantity results in a non-empty cart', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();
  await results.openResultByIndex(0);

  await product.assertOpened();
  await product.addToCartWithQuantity(2);
  await product.openCartFromSuccessAlert();

  await cart.assertOpened();
  await cart.assertHasItems();

  const items = await cart.getItemCount();
  expect(items).toBeGreaterThan(0);
});
