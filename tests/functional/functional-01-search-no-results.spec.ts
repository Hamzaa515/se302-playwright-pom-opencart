import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';

test('Functional-01: Nonsense search shows empty state', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);

  await home.visit();
  await home.search('zzq__unlikely__token__99127');
  await results.assertNoResults();
});
