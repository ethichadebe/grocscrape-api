import express from 'express';
import bodyParser from 'body-parser';
import scrapeSite from './scraper.mjs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('GrocScrape API is running');
});

app.post('/api/scrape', async (req, res) => {
  try {
    const { keyword, searchURL } = req.body;

    if (!keyword || !searchURL) {
      return res.status(400).json({ error: 'Missing keyword or searchURL' });
    }

    const results = await scrapeSite(keyword, searchURL);
    res.json({ keyword, searchURL, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape site', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
