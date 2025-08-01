import express from 'express';
import scrapeShoprite from './scraper';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GrocScrape API is live');
});

app.post('/api/scrape', async (req, res) => {
  const { keyword, searchURL } = req.body;

  if (!keyword || !searchURL) {
    return res.status(400).json({ error: 'Missing keyword or searchURL' });
  }

  try {
    const results = await scrapeShoprite(searchURL);
    res.json({ keyword, searchURL, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape site', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
