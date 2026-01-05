import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Functional-09: Invalid credentials show a warning on login', async ({ page }) => {
  const login = new LoginPage(page);

  await login.visit();
  await login.login('nobody@example.com', 'definitely-wrong-password');
  await login.assertLoginFailed();
});
