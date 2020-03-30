import BaseRouter from './controllers';
import cors from 'cors'
const bodyParser = require('body-parser');
const express = require('express')

const app = express()
app.use(bodyParser.json());
app.use(cors())


app.get('/', cors(), function (req: any, res: any) {
	return res.send('pong');
});

app.get('/ping', cors(), function (req: any, res: any) {
	return res.send('pong');
});

const version = `v1`
export const API_VERSION_STRING = `/api/${version}/`
app.use(API_VERSION_STRING, BaseRouter);


export default app