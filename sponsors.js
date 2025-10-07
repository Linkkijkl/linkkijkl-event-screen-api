const express = require('express');
const cheerio = require('cheerio');
const { fetchData, handleError } = require('./utils');
const { LINKKI_SPONSORS_URL, ALGO_SPONSORS_URL } = require('./config');

const router = express.Router();

router.get('/linkki', async (req, res) => {
  try {
    const sponsors = await fetchData(LINKKI_SPONSORS_URL);
    const imageUrls = Object.keys(sponsors).map(key => `https://linkkijkl.fi${sponsors[key].image}`);
    res.send(imageUrls);
  } catch (err) {
    handleError(err, res);
  }
});

router.get('/algo', async (req, res) => {
  try {
    const data = await fetchData(ALGO_SPONSORS_URL)
    res.send(data)
  } catch (err) {
    handleError(err, res);
  }
})

module.exports = router;
