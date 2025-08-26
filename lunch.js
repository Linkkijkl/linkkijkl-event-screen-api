const express = require('express');
const { fetchData, handleError } = require('./utils');
const { SEMMA_API_URL, COMPASS_API_URL } = require('./config');

const router = express.Router();

router.get('/piato', (req, res) => getLunch(req, res, SEMMA_API_URL, 1408));
router.get('/bistro', (req, res) => getLunch(req, res, COMPASS_API_URL, 3081));

const getLunch = async (req, res, apiURL, restaurantId) => {
  try {
    const date = new Date().toISOString();
    const url = `${apiURL}?date=${date}&language=fi&costCenter=${restaurantId}`;
    const data = await fetchData(url);

    const menuPackages = data?.menuPackages.filter(item => 
        ! item.price?.includes("EI KELA")
    )

    res.send(menuPackages || []);
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = router;
