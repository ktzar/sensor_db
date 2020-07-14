const request = require('supertest');
const express = require('express');
const db = require('../db');

const dataRouter = require('./data');

describe('Data router', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/data', dataRouter);
        db.reset();
    });

    it('returns 204 when putting a reading and 409 when setting a duplicated reading', async () => {
        let res = await request(app)
            .put('/data/')
            .send({sensorId: '234', time: 15500, value: 45});
        expect(res.statusCode).toEqual(204);

        res = await request(app)
            .put('/data/')
            .send({sensorId: '234', time: 15500, value: 45});
        expect(res.statusCode).toEqual(409);
    });


    it('returns 409 when putting a reading with missing data', async () => {
        let res = await request(app)
            .put('/data/')
            .send({sensorId: '234', NOTtime: 15500, value: 45});

        expect(res.statusCode).toEqual(400);
    });

    it('stores readings in the database', async () => {
        await request(app)
            .put('/data/')
            .send({sensorId: '234', time: 15500, value: 45});

        expect(db.db.sensorReadings.length).toEqual(1);
        expect(db.db.sensorReadings[0]).toEqual(
            {sensorId: '234', time: 15500, value: 45}
        );
    });

    it('can filter readings', async () => {
        await request(app)
            .put('/data/')
            .send({sensorId: '234', time: 15500, value: 45});
        await request(app)
            .put('/data/')
            .send({sensorId: '234', time: 15505, value: 45});

        const res = await request(app)
            .get('/data/234/15400/15504');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([
            {sensorId: '234', time: 15500, value: 45}
        ]);
    });

});
