const express = require('express');
require('dotenv').config();
const app = express();

const dataRoute = require('./routes/data');
const alertRoute = require('./routes/alert');

app.use(express.json());

const PORT = process.env.APP_PORT || 3000;

app.use('/data', dataRoute);
app.use('/alerts', alertRoute);

app.listen(PORT, () => console.log(`Listening at ${PORT}`));
