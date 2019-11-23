import BaseRouter from './controllers';

const express = require('express')
const app = express()

app.use('/api/v1/', BaseRouter);

export default app