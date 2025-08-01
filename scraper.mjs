import { chromium } from 'playwright';

export default async function scrapeSite(keyword, searchURL) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const items = [];

  try {
    await page.goto(searchURL, { timeout: 60000 });

    await page.waitForSelector('div.product-listing__product-card', { timeout: 10000 });

    const results = await page.$$eval('div.product-listing__product-card', cards =>
      cards.map(card => ({
        name: card.querySelector('.product-card__title')?.innerText || '',
        price: card.querySelector('.now')?.innerText || '',
        image: card.querySelector('img')?.src || '',
        special: card.querySelector('.product-badge__text')?.innerText || '',
      }))
    );

    items.push(...results);
  } catch (err) {
    console.error('Scraping error:', err.message);
    throw err;
  } finally {
    await browser.close();
  }

  return items;
}
