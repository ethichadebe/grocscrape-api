import { chromium } from 'playwright';

export default async function scrapeShoprite(searchURL) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(searchURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.item-product__name', { timeout: 10000 });

    const results = await page.$$eval('.product-frame', (cards) =>
      cards.map((card) => {
        const title = card.querySelector('.item-product__name a')?.innerText.trim() || '';
        const price = card.querySelector('.special-price__price .now')?.innerText.replace(/\s+/g, '') || '';
        const image = card.querySelector('.item-product__image img')?.src || '';
        const link = card.querySelector('.item-product__name a')?.href || '';
        return { title, price, image, link };
      })
    );

    await browser.close();
    return results.filter((r) => r.title && r.price);
  } catch (err) {
    await browser.close();
    throw err;
  }
}
