import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('Functional-06: Updating cart quantity affects the displayed totals', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();
  await results.openResultByIndex(0);

  await product.assertOpened();
  await product.addToCartWithQuantity(1);
  await product.openCartFromSuccessAlert();

  await cart.assertOpened();
  await cart.assertHasItems();

  const before = await cart.getGrandTotal();

  await cart.updateQuantityByIndex(0, 3);

  const after = await cart.getGrandTotal();
  expect(after).not.toBe(before);
});
