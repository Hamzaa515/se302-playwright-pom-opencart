import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  private readonly cartTable: Locator;
  private readonly cartRows: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly checkoutButton: Locator;
  private readonly updateButtons: Locator;
  private readonly removeButtons: Locator;
  private readonly totalSection: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartTable = page.locator('.table-responsive');
    this.cartRows = this.cartTable.locator('tbody tr');
    this.emptyCartMessage = page.locator('#content').getByText(/your shopping cart is empty/i);

    this.checkoutButton = page.getByRole('link', { name: /checkout/i });

    this.updateButtons = page.locator('button[data-original-title="Update"]');
    this.removeButtons = page.locator('button[data-original-title="Remove"]');

    this.totalSection = page.locator('#content .table.table-bordered');
  }

  async assertOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/route=checkout\/cart/i);
    await expect(this.page.locator('#content h1')).toBeVisible();
  }

  async getItemCount(): Promise<number> {
    await this.assertOpened();
    return await this.cartRows.count();
  }

  async assertHasItems(): Promise<void> {
    await this.assertOpened();
    await expect(this.cartRows.first()).toBeVisible();
  }

  async assertEmpty(): Promise<void> {
    await this.assertOpened();
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async removeItemByIndex(index: number): Promise<void> {
    await this.assertOpened();

    const count = await this.cartRows.count();
    if (count === 0) throw new Error('removeItemByIndex: cart is already empty');
    if (index < 0 || index >= count) {
      throw new Error(`removeItemByIndex: index out of range (0..${count - 1})`);
    }

    await this.removeButtons.nth(index).click();
  }

  async updateQuantityByIndex(index: number, quantity: number): Promise<void> {
    await this.assertOpened();

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error('updateQuantityByIndex: quantity must be positive');
    }

    const row = this.cartRows.nth(index);
    const qtyInput = row.locator('input[name*="quantity"]');

    await expect(qtyInput).toBeVisible();
    await qtyInput.fill(String(Math.floor(quantity)));

    await this.updateButtons.nth(index).click();
  }

  async getGrandTotal(): Promise<string> {
    await this.assertOpened();
    const raw = (await this.totalSection.textContent()) ?? '';
    return normalize(raw);
  }

  async proceedToCheckout(): Promise<void> {
    await this.assertOpened();
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/route=checkout\/checkout/i);
  }
}

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}
