import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';

test('Functional-03: Refining an existing search can yield no results', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);

  await home.visit();
  await home.search('iphone');
  await results.assertHasResults();

  await results.refineSearch('no_such_product_name_88421');
  await results.assertNoResults();
});
