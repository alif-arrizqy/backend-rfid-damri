import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connection} from './connection.js';

import indexRouter from './routes/index.js'

const env = dotenv.config().parsed;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: env.CORS_ORIGIN,
}));

app.use('/', indexRouter);
app.use('/test', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

// connect to mongodb
connection()

app.listen(env.APP_PORT, () => {
    console.log(`server is running on port ${env.APP_PORT}`);
})
