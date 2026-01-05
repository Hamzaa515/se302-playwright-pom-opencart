import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';

test('Functional-02: Search tolerates surrounding whitespace', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);

  await home.visit();
  await home.search('   iphone   ');
  await results.assertHasResults();
});
