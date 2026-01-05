import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Functional-10: Forgotten Password link navigates to recovery page', async ({ page }) => {
  const login = new LoginPage(page);

  await login.visit();
  await login.openForgottenPassword();
});
