import { expect, Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  private readonly content: Locator;
  private readonly title: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly successAlert: Locator;
  private readonly alertText: Locator;
  private readonly cartLinkInAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.content = page.locator('#content');
    this.title = page.locator('#content h1').first();

    this.quantityInput = page.locator('#input-quantity');
    this.addToCartButton = page.locator('#button-cart');

    this.successAlert = page.locator('.alert.alert-success');
    this.alertText = this.successAlert.locator('text=*');

    this.cartLinkInAlert = this.successAlert.getByRole('link', { name: /shopping cart/i });
  }

  async assertOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/route=product\/product/i);
    await expect(this.title).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async getTitle(): Promise<string> {
    await this.assertOpened();
    const t = (await this.title.textContent()) ?? '';
    return t.trim();
  }

  async setQuantity(qty: number): Promise<void> {
    await this.assertOpened();

    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error('setQuantity: qty must be a positive number');
    }

    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill(String(Math.floor(qty)));
  }

  async addToCart(): Promise<void> {
    await this.assertOpened();

    await this.addToCartButton.click();

    await expect(this.successAlert).toBeVisible();
  }

  async addToCartWithQuantity(qty: number): Promise<void> {
    await this.setQuantity(qty);
    await this.addToCart();
  }

  async getSuccessMessage(): Promise<string> {
    await expect(this.successAlert).toBeVisible();
    const raw = (await this.successAlert.textContent()) ?? '';
    return normalizeSpaces(raw);
  }

  async openCartFromSuccessAlert(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
    await this.cartLinkInAlert.click();
    await expect(this.page).toHaveURL(/route=checkout\/cart/i);
  }

  async assertSuccessContains(textFragment: string): Promise<void> {
    const frag = textFragment.trim();
    if (!frag) throw new Error('assertSuccessContains: provide a non-empty fragment');

    await expect(this.successAlert).toBeVisible();
    await expect(this.successAlert).toContainText(new RegExp(escapeRx(frag), 'i'));
  }
}

function normalizeSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function escapeRx(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
