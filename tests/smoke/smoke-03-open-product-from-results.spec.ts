import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';
import { ProductPage } from '../../pages/ProductPage';

test('Smoke-03: A product can be opened from search results and shows a title', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();

  await results.openResultByIndex(0);

  await product.assertOpened();
  const title = await product.getTitle();
  expect(title.length).toBeGreaterThan(0);
});
