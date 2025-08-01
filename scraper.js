const { chromium } = require('playwright');

async function scrape(keyword, searchURL) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(searchURL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const items = await page.$$eval('[data-automation-id="product-card"]', (cards) =>
      cards.map(card => {
        const name = card.querySelector('[data-automation-id="product-title"]')?.innerText?.trim();
        const price = card.querySelector('[data-automation-id="product-price"]')?.innerText?.trim();
        const image = card.querySelector('img')?.src;
        return { name, price, image };
      })
    );

    await browser.close();
    return items.filter(item => item.name && item.price);
  } catch (err) {
    await browser.close();
    throw err;
  }
}

module.exports = scrape;
