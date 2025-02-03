const express = require('express');
const { fetchData, handleError } = require('./utils');
const { SEMMA_API_URL } = require('./config');

const router = express.Router();

router.get('/piato', (req, res) => getLunch(req, res, 1408));
router.get('/maija', (req, res) => getLunch(req, res, 1402));

const getLunch = async (req, res, restaurantId) => {
  try {
    const date = new Date().toISOString();
    const url = `${SEMMA_API_URL}?date=${date}&language=fi&costCenter=${restaurantId}`;
    const data = await fetchData(url);
    res.send(data?.menuPackages || []);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = router;
