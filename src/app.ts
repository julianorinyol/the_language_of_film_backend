import BaseRouter from './controllers';
import cors from 'cors'

const express = require('express')
const app = express()
app.use(cors())

app.get('/ping', cors(), function (req: any, res: any) {
	return res.send('pong');
});

const version = `v1`
app.use(`/api/${version}/`, BaseRouter);


export default app