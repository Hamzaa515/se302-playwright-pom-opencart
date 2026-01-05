import { expect, Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  private readonly resultsContainer: Locator;
  private readonly productTiles: Locator;
  private readonly listToolbar: Locator;
  private readonly sortSelect: Locator;
  private readonly keywordInput: Locator;
  private readonly searchButton: Locator;
  private readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;

    this.resultsContainer = page.locator('#content');
    this.productTiles = page.locator('#content .product-layout');
    this.listToolbar = page.locator('#content .product-list, #content .product-grid').first();
    this.sortSelect = page.locator('#input-sort');
    this.keywordInput = page.locator('#content input[name="search"]');
    this.searchButton = page.locator('#content input[name="search"] ~ span button');
    this.emptyState = page.locator('#content').getByText(/there is no product that matches the search criteria/i);
  }

  async assertOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/route=product\/search/i);
    await expect(this.resultsContainer).toBeVisible();
  }

  async hasAnyResults(): Promise<boolean> {
    return (await this.productTiles.count()) > 0;
  }

  async assertHasResults(): Promise<void> {
    await this.assertOpened();
    await expect(this.productTiles.first()).toBeVisible();
  }

  async assertNoResults(): Promise<void> {
    await this.assertOpened();
    await expect(this.emptyState).toBeVisible();
  }

  async openResultByIndex(index: number): Promise<void> {
    await this.assertOpened();

    const count = await this.productTiles.count();
    if (count === 0) throw new Error('openResultByIndex: no results available');
    if (index < 0 || index >= count) throw new Error(`openResultByIndex: index out of range (0..${count - 1})`);

    const tile = this.productTiles.nth(index);
    await tile.getByRole('link').first().click();
  }

  async openResultByName(name: string): Promise<void> {
    await this.assertOpened();

    const n = name.trim();
    if (!n) throw new Error('openResultByName: name must be non-empty');

    const target = this.resultsContainer
      .locator('.product-layout')
      .filter({ has: this.page.getByRole('link', { name: new RegExp(escapeRx(n), 'i') }) })
      .first();

    await expect(target).toBeVisible();
    await target.getByRole('link', { name: new RegExp(escapeRx(n), 'i') }).first().click();
  }

  async setSort(optionLabel: string): Promise<void> {
    await this.assertOpened();

    const label = optionLabel.trim();
    if (!label) throw new Error('setSort: optionLabel must be non-empty');

    await expect(this.sortSelect).toBeVisible();
    await this.sortSelect.selectOption({ label });

    await expect(this.page).toHaveURL(/sort=/i);
  }

  async refineSearch(keyword: string): Promise<void> {
    await this.assertOpened();

    const k = keyword.trim();
    if (!k) throw new Error('refineSearch: keyword must be non-empty');

    await this.keywordInput.fill(k);
    await this.searchButton.click();

    await expect(this.page).toHaveURL(/route=product\/search/i);
  }
}

function escapeRx(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
