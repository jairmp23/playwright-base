import { chromium } from 'playwright';
import logger from '../logger/logger-config.js';

class PlaywrightDriver {
  constructor() {
    this.browser = null;
    this.page = null;
    this.context = null;
    this.previousPage = null;
  }

  /**
   * Initializes the browser and a new page.
   * @param {boolean} headless - Whether to run in headless mode.
   */
  async init(headless = true) {
    this.browser = await chromium.launch({ headless });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    logger.info('Browser and page initialized.');
  }

  /**
   * Waits for a specified amount of time.
   * @param {number} ms - Time in milliseconds to wait.
   */
  async wait(ms) {
    logger.info(`Waiting for ${ms} milliseconds...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Navigates to a specified URL.
   * @param {string} url - The URL to navigate to.
   */
  async goTo(url) {
    await this.retry(async () => {
      await this.page.goto(url);
      logger.info(`Navigated to: ${url}`);
    });
  }

  /**
   * Clicks on a specified selector.
   * @param {string} selector - The selector of the element to click.
   */
  async click(selector) {
    await this.retry(async () => {
      await this.page.click(selector);
      logger.info(`Clicked on selector: ${selector}`);
    });
  }

  /**
   * Fills an input field.
   * @param {string} selector - The selector of the input field.
   * @param {string} value - The value to fill.
   */
  async fill(selector, value) {
    await this.retry(async () => {
      await this.page.fill(selector, value);
      logger.info(`Filled input ${selector} with value: ${value}`);
    });
  }

  /**
   * Moves the mouse over an element.
   * @param {string} selector - The selector of the element.
   */
  async hover(selector) {
    await this.retry(async () => {
      await this.page.hover(selector);
      logger.info(`Hovered over selector: ${selector}`);
    });
  }

  /**
   * Switches to a new page or popup.
   * @param {Function} callback - The action that triggers the new page.
   */
  async switchToNewPage() {
    const newPagePromise = this.context.waitForEvent('page');
    const newPage = await newPagePromise;

    if (!newPage) {
      logger.error('No new window detected');
    }
    this.previousPage = this.page;
    this.page = newPage;
    logger.info('Switched to a new page.');
  }

  /**
   * Returns to the previous page.
   */
  async switchBack() {
    if (this.previousPage) {
      this.page = this.previousPage;
      this.previousPage = null;
      logger.info('Switched back to the previous page.');
    } else {
      logger.warn('No previous page to switch back to.');
    }
  }

  /**
   * Retries an action multiple times if it fails.
   * @param {Function} action - The action to retry.
   * @param {number} retries - Number of retries.
   */
  async retry(action, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        logger.warn(`Attempt ${attempt} failed. Retrying...`);
        if (attempt === retries) {
          logger.error('Max retries reached. Throwing error.');
          this.wait(500);
          throw error;
        }
      }
    }
  }

  /**
   * Closes the browser.
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      logger.info('Browser closed.');
    }
  }
}

export default PlaywrightDriver;
