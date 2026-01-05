# SE302 – Playwright POM Automation Project (OpenCart)

This repository contains the course project for SE302 – Software Testing and Maintenance.  
The project focuses on designing and implementing an automated web testing suite using Playwright and the Page Object Model (POM) architecture.

The selected application under test is the OpenCart demo website:  
https://demo.opencart.com/

The main objective of this project is to create a clean, maintainable, and structured automation framework that includes smoke tests, functional tests, and clear evidence of execution, in accordance with the course requirements.

---

## Project Scope

The automation suite validates core user-facing functionality of the OpenCart demo application, including:

- Homepage availability and navigation  
- Product search and search result handling  
- Product details and add-to-cart flow  
- Shopping cart operations (update, remove, totals)  
- Checkout access and guest checkout validation  
- Account login error handling and password recovery navigation  

The project strictly follows the **Page Object Model** principle:
- All locators and UI interactions are defined inside page classes
- Test files contain no locators and interact only through page object methods

---

## Technologies Used

- Playwright (TypeScript)
- Node.js
- npm
- Page Object Model (POM) architecture

---

## Project Structure

.
├── pages/
│ ├── HomePage.ts
│ ├── SearchResultsPage.ts
│ ├── ProductPage.ts
│ ├── CartPage.ts
│ ├── CheckoutPage.ts
│ └── LoginPage.ts
│
├── tests/
│ ├── smoke/
│ │ └── 5 smoke test cases
│ └── functional/
│ └── 10 functional test cases
│
├── playwright.config.ts
├── README.md
└── .gitignore

yaml
Kopiraj kod

---

## Test Coverage

The project includes 15 automated test cases in total:

### Smoke Tests (5)
Smoke tests verify that the main application flow is available and responsive:
- Homepage loads successfully
- Search functionality works
- Product pages open correctly
- Items can be added to the cart
- Checkout page is reachable from the cart

### Functional Tests (10)
Functional tests validate detailed user scenarios and edge cases:
- Search with no results
- Search input trimming
- Refining search queries
- Opening products by name
- Adding products with specific quantities
- Updating cart quantities and totals
- Removing items from the cart
- Guest checkout validation errors
- Invalid login warnings
- Forgotten password navigation

---

## Prerequisites

Before running the tests, make sure the following are installed:

- Node.js (LTS recommended)
- npm

---

## Setup Instructions

1. lone the repository
```bash
git clone https://github.com/<your-username>/se302-playwright-pom-opencart.git
cd se302-playwright-pom-opencart
Install dependencies

bash

npm install
Install Playwright browsers

bash

npx playwright install
Running the Tests
Run all tests
bash
npx playwright test
Run tests in headed mode
bash

npx playwright test --headed
Run a specific test file
bash

npx playwright test tests/smoke/smoke-01-home-ready.spec.ts
View the HTML report
bash

npx playwright show-report
