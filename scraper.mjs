import { chromium } from 'playwright';

export async function scrapeSite(keyword, searchURL) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`[INFO] Navigating to ${searchURL}`);
    await page.goto(searchURL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for product tiles to load
    await page.waitForSelector('[data-auto="product-tile"]', { timeout: 10000 });

    const products = await page.$$eval('[data-auto="product-tile"]', items =>
      items.map(item => {
        const name = item.querySelector('[data-auto="product-title"]')?.innerText.trim() || 'No name';
        const price = item.querySelector('[data-auto="product-price"]')?.innerText.trim() || 'No price';
        const image = item.querySelector('img')?.src || '';
        const link = item.querySelector('a')?.href || '';
        return { name, price, image, link };
      })
    );

    return products;
  } catch (error) {
    console.error('[ERROR] Scraping failed:', error);
    throw new Error('Scraping failed: ' + error.message);
  } finally {
    await browser.close();
  }
}
