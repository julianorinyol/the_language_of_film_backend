import BaseRouter from './controllers';
import cors from 'cors'

const express = require('express')
const app = express()
app.use(cors())


app.use('/api/v1/', BaseRouter);

export default app