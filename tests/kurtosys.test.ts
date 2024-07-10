import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Go to https://www.kurtosys.com/
    console.log('Navigating to the homepage...');
    await page.goto('https://www.kurtosys.com/');
    await page.waitForLoadState('networkidle');

    // Step 2: Navigate to “RESOURCES”
    console.log('Navigating to RESOURCES...');
    await page.waitForSelector('text=RESOURCES', { timeout: 30000 });
    await page.click('text=RESOURCES');
    await page.waitForLoadState('networkidle');

    // Step 3: Click on “White Papers & eBooks”
    console.log('Clicking on White Papers & eBooks...');
    await page.waitForTimeout(5000); // Wait for any animations to complete
    await page.waitForSelector('text=White Papers & eBooks', { timeout: 30000 });
    const elements = await page.$$('text=White Papers & eBooks');
    for (const element of elements) {
      const isVisible = await element.isVisible();
      if (isVisible) {
        await element.click({ timeout: 30000 });
        break;
      }
    }
    await page.waitForLoadState('networkidle');

    // Step 4: Verify Title reads “White Papers”
    console.log('Verifying title...');
    await page.waitForSelector('h1', { timeout: 30000 });
    const title = await page.textContent('h1');
    if (title !== 'White Papers') {
      throw new Error('Test failed: Title does not read "White Papers"');
    }

    // Step 5: Click on any white paper tile
    console.log('Clicking on UCITS Whitepaper...');
    await page.waitForSelector('text=UCITS Whitepaper', { timeout: 30000 });
    await page.click('text=UCITS Whitepaper', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Step 6-9: Fill in the fields
    console.log('Filling in the fields...');
    await page.waitForSelector('input[name="First Name"]', { timeout: 30000 });
    await page.fill('input[name="First Name"]', 'John');
    await page.fill('input[name="Last Name"]', 'Doe');
    await page.fill('input[name="Company"]', 'Example Company');
    await page.fill('input[name="Industry"]', 'Finance');

    // Step 10: Do not populate the "Email" field

    // Step 11: Click “Send me a copy”
    console.log('Clicking on Send me a copy...');
    await page.waitForSelector('button:has-text("Send me a copy")', { timeout: 30000 });
    await page.click('button:has-text("Send me a copy")');

    // Step 12: Add screenshot of the error messages
    console.log('Taking a screenshot of the error messages...');
    await page.waitForSelector('.error-message', { timeout: 30000 });
    await page.screenshot({ path: 'error_messages.png' });

    // Step 13: Validate all error messages
    console.log('Validating error messages...');
    const errorMessages = await page.$$('.error-message');
    if (errorMessages.length > 0) {
      console.log('Test passed: Error messages are displayed.');
    } else {
      throw new Error('Test failed: No error messages displayed.');
    }

    console.log('Test completed successfully.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('An error occurred:', error.message);
    } else {
      console.error('An unexpected error occurred');
    }
  } finally {
    // Close browser
    await browser.close();
  }
})();
