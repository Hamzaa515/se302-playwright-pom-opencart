import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';

test('Smoke-02: Search returns at least one product for a common query', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();
});
