import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  private readonly content: Locator;
  private readonly heading: Locator;

  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  private readonly warningAlert: Locator;
  private readonly forgottenPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.content = page.locator('#content');
    this.heading = this.content.locator('h2').filter({ hasText: /returning customer/i }).first();

    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginButton = this.content.locator('form').getByRole('button', { name: /^login$/i });

    this.warningAlert = page.locator('.alert.alert-danger, .alert.alert-warning');
    this.forgottenPasswordLink = this.content.getByRole('link', { name: /forgotten password/i });
  }

  async visit(): Promise<void> {
    await this.page.goto('/index.php?route=account/login');
    await this.assertOpened();
  }

  async assertOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/route=account\/login/i);
    await expect(this.content).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.assertOpened();

    const e = email.trim();
    const p = password;

    if (!e) throw new Error('login: email must be non-empty');
    if (!p) throw new Error('login: password must be non-empty');

    await this.emailInput.fill(e);
    await this.passwordInput.fill(p);
    await this.loginButton.click();
  }

  async assertLoginFailed(): Promise<void> {
    await expect(this.warningAlert).toBeVisible();
  }

  async openForgottenPassword(): Promise<void> {
    await this.assertOpened();
    await this.forgottenPasswordLink.click();
    await expect(this.page).toHaveURL(/route=account\/forgotten/i);
  }

  async clearForm(): Promise<void> {
    await this.assertOpened();
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
  }
}
