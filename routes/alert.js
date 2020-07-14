const express = require('express');
const db = require('../db').db;

const router = express.Router();

router.post('/', (req, res) => {
    const {sensorId, threshold} = req.body;
    if (!sensorId || !threshold) {
        res.status(400).end();
    } else {
        db.thresholds[sensorId] = threshold;
        res.status(204).end();
    }
});

module.exports = router;
