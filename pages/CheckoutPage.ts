import { expect, Locator, Page } from '@playwright/test';

export type GuestBillingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address1: string;
  city: string;
  postcode: string;
  country: string; 
  region: string;  
};

export class CheckoutPage {
  readonly page: Page;

  private readonly content: Locator;
  private readonly pageHeading: Locator;

  private readonly checkoutOptionsPanel: Locator;
  private readonly guestRadio: Locator;
  private readonly optionsContinueBtn: Locator;

  private readonly billingPanel: Locator;
  private readonly billingContinueBtn: Locator;

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly telephoneInput: Locator;
  private readonly address1Input: Locator;
  private readonly cityInput: Locator;
  private readonly postcodeInput: Locator;
  private readonly countrySelect: Locator;
  private readonly regionSelect: Locator;

  private readonly warningAlert: Locator;
  private readonly fieldErrors: Locator;

  private readonly paymentMethodPanel: Locator;
  private readonly agreeTermsCheckbox: Locator;
  private readonly paymentContinueBtn: Locator;

  private readonly confirmPanel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.content = page.locator('#content');
    this.pageHeading = this.content.locator('h1').first();

    this.checkoutOptionsPanel = page.locator('#accordion .panel').filter({
      has: page.getByRole('heading', { name: /checkout options/i }),
    });

    this.guestRadio = page.locator('input[name="account"][value="guest"]');
    this.optionsContinueBtn = page.locator('#button-account');

    this.billingPanel = page.locator('#accordion .panel').filter({
      has: page.getByRole('heading', { name: /billing details/i }),
    });

    this.firstNameInput = page.locator('#input-payment-firstname');
    this.lastNameInput = page.locator('#input-payment-lastname');
    this.emailInput = page.locator('#input-payment-email');
    this.telephoneInput = page.locator('#input-payment-telephone');
    this.address1Input = page.locator('#input-payment-address-1');
    this.cityInput = page.locator('#input-payment-city');
    this.postcodeInput = page.locator('#input-payment-postcode');
    this.countrySelect = page.locator('#input-payment-country');
    this.regionSelect = page.locator('#input-payment-zone');

    this.billingContinueBtn = page.locator('#button-guest');

    this.warningAlert = page.locator('.alert.alert-danger, .alert.alert-warning');
    this.fieldErrors = page.locator('.text-danger');

    this.paymentMethodPanel = page.locator('#accordion .panel').filter({
      has: page.getByRole('heading', { name: /payment method/i }),
    });

    this.agreeTermsCheckbox = page.locator('input[name="agree"]');
    this.paymentContinueBtn = page.locator('#button-payment-method');

    this.confirmPanel = page.locator('#accordion .panel').filter({
      has: page.getByRole('heading', { name: /confirm order/i }),
    });
  }

  async assertOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/route=checkout\/checkout/i);
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageHeading).toContainText(/checkout/i);
  }

  async selectGuestCheckout(): Promise<void> {
    await this.assertOpened();

    await expect(this.optionsContinueBtn).toBeVisible();
    await this.guestRadio.check();
    await this.optionsContinueBtn.click();

    await expect(this.firstNameInput).toBeVisible();
  }

  async fillGuestBillingDetails(details: GuestBillingDetails): Promise<void> {
    await this.assertOpened();

    await expect(this.firstNameInput).toBeVisible();

    await this.firstNameInput.fill(details.firstName.trim());
    await this.lastNameInput.fill(details.lastName.trim());
    await this.emailInput.fill(details.email.trim());
    await this.telephoneInput.fill(details.telephone.trim());
    await this.address1Input.fill(details.address1.trim());
    await this.cityInput.fill(details.city.trim());
    await this.postcodeInput.fill(details.postcode.trim());

    await this.countrySelect.selectOption({ label: details.country });
    await this.regionSelect.selectOption({ label: details.region });
  }

  async continueFromBilling(): Promise<void> {
    await this.assertOpened();

    await expect(this.billingContinueBtn).toBeVisible();
    await this.billingContinueBtn.click();
  }

  async assertShowsValidationErrors(): Promise<void> {
    await this.assertOpened();

    await expect(this.warningAlert.or(this.fieldErrors)).toBeVisible();
  }

  async agreeToTerms(): Promise<void> {
    await this.assertOpened();
    await expect(this.agreeTermsCheckbox).toBeVisible();
    await this.agreeTermsCheckbox.check();
  }

  async continueFromPaymentMethod(): Promise<void> {
    await this.assertOpened();
    await expect(this.paymentContinueBtn).toBeVisible();
    await this.paymentContinueBtn.click();
  }

  async assertPaymentMethodStepVisible(): Promise<void> {
    await this.assertOpened();
    await expect(this.paymentMethodPanel).toBeVisible();
  }

  async assertConfirmOrderStepVisible(): Promise<void> {
    await this.assertOpened();
    await expect(this.confirmPanel).toBeVisible();
  }
}
