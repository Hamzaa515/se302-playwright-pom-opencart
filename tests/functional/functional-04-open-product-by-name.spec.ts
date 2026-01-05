import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';

test('Functional-04: Open a specific product by name from search results', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();

  await results.openResultByName('iPhone');

  await product.assertOpened();
  const title = await product.getTitle();
  expect(title).toMatch(/iphone/i);
});
