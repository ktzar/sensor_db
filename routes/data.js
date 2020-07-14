const express = require('express');

const { db } = require('../db');
const { validateReading } = require('../models/reading'); 

const notifyAlert = text => console.log('ALERT: ' + text);

const router = express.Router();

router.get('/:sensorId/:since/:until', (req, res) => {
    const {sensorId, since, until} = req.params;

    res.send(db.sensorReadings.filter(r => 
        r.sensorId === sensorId &&
        r.time >= since &&
        r.time <= until
    )).end();
});

router.put('/', (req, res) => {
    const reading = req.body;
    const {sensorId, time, value} = reading;

    if (!sensorId || !time) {
        res.status(400).end();
        return;
    } else if (db.sensorReadings.find(r =>
        r.sensorId === sensorId && 
        r.time === time)
    ) {
        res.status(409).end();
        return;
    } else if (validateReading(req.body)) {
        db.sensorReadings.push(reading);
        res.status(204).end();
        const sensorThreshold = db.thresholds[sensorId];
        if (sensorThreshold && value > sensorThreshold) {
            notifyAlert(`Sensor ${sensorId} exceeded the configured threshold ${sensorThreshold}`);
        }
    }
    res.status(500).end();
});

module.exports = router;
