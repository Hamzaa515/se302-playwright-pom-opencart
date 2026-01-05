import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('Smoke-01: Home renders primary navigation and search', async ({ page }) => {
  const home = new HomePage(page);

  await home.visit();
  await home.assertLoaded();
});
