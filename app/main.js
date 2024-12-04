import logger from './logger/logger-config.js';
import PlaywrightDriver from './playwright-driver/playwright-driver.js';

(async () => {
  const driver = new PlaywrightDriver();

  try {
    await driver.init();
    await driver.goTo('https://google.com');
    await driver.wait(2000);
  } catch (error) {
    logger.error('Test failed:', error);
  } finally {
    await driver.close();
  }
})();
