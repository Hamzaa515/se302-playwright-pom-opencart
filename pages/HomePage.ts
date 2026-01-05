import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  private readonly brandLink: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly navBar: Locator;
  private readonly topLinks: Locator;
  private readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    
    this.brandLink = page.locator('#logo a');

    this.searchInput = page.locator('#search input[name="search"]');
    this.searchButton = page.locator('#search button[type="button"]');

    this.navBar = page.locator('#menu');
    this.topLinks = page.locator('#top-links');


    this.cartButton = page.locator('#header-cart button, #cart button').first();
  }

  async visit(): Promise<void> {
    await this.page.goto('/');
    await this.assertLoaded();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.brandLink).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.navBar).toBeVisible();
  }

  async search(query: string): Promise<void> {
    const q = query.trim();
    if (!q) throw new Error('search(query): query must be non-empty');

    await this.searchInput.fill(q);
    await this.searchButton.click();

    await expect(this.page).toHaveURL(/route=product\/search/i);
  }

  async openCategory(path: string[]): Promise<void> {
    if (path.length === 0) throw new Error('openCategory(path): provide at least one label');

    const labels = path.map((x) => x.trim()).filter(Boolean);
    if (labels.length === 0) throw new Error('openCategory(path): labels must be non-empty');

    
    const first = this.navBar.getByRole('link', {
      name: new RegExp(`^${escapeRx(labels[0])}$`, 'i'),
    });

    await first.hover();
    await first.click();

    for (let i = 1; i < labels.length; i++) {
      const next = this.navBar.getByRole('link', {
        name: new RegExp(`^${escapeRx(labels[i])}$`, 'i'),
      });

      await next.hover();
      await next.click();
    }

    await expect(this.page).toHaveURL(/route=product\/category/i);
  }

  async openCartFromHeader(): Promise<void> {
    await this.topLinks.getByRole('link', { name: /shopping cart/i }).click();
    await expect(this.page).toHaveURL(/route=checkout\/cart/i);
  }

  async openHomeByBrand(): Promise<void> {
    await this.brandLink.click();
    await expect(this.page).toHaveURL(/\/(\?.*)?$/);
    await this.assertLoaded();
  }
}

function escapeRx(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
