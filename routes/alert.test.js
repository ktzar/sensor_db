const request = require('supertest');
const express = require('express');
const db = require('../db');

const alertRouter = require('./alert');

describe('Alert router', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/alerts', alertRouter);
        db.reset();
    });

    it('returns 204 when setting a threshold with the right data', async () => {
        const res = await request(app)
            .post('/alerts/')
            .send({sensorId: '234', threshold: 23});

        expect(res.statusCode).toEqual(204);
    });

    it('returns 400 when not sending the right data', async () => {
        const res = await request(app)
            .post('/alerts/')
            .send({other: 'value'});

        expect(res.statusCode).toEqual(400);
    });

    it('stores thresholds in the db', async () => {
        const res = await request(app)
            .post('/alerts/')
            .send({sensorId: '234', threshold: 23});

        expect(db.db.thresholds['234']).toEqual(23);
    });
});
