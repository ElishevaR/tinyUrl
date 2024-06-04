
import express from 'express'
import cors from "cors"
import bodyParser from "body-parser";

import connectDB from './database.js';
import LinkRouter from './Routers/LinkRouter.js'
import UserRouter from './Routers/UserRouter.js'
connectDB();
const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = 3001

app.use(express.json());

// app.use((req, res, next) => {
//     req.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//     next();
// });
app.use('/links', LinkRouter)
app.use('/users', UserRouter)

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})