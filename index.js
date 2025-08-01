const express = require('express');
const scrape = require('./scraper');

const app = express();
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { keyword, searchURL } = req.body;
  try {
    const results = await scrape(keyword, searchURL);
    res.json({ keyword, searchURL, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape site', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
