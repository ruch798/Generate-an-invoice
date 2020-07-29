import express from "express";
import mongoose from 'mongoose';
import { restRouter } from "./api/index.js";
import { devConfig } from './config/env/development';
import { setGlobalMiddleware } from "./api/middlewares/global-middleware.js";
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost/${devConfig.database}`);
// mongoose.connect('https://cloud.mongodb.com/v2/5e5352b6063e812ba4b25ccf#clusters');

const app = express();
// const express = require('express');
// const app = express();
const PORT = devConfig.port;

//register global middleware
setGlobalMiddleware(app);

app.use('/api',restRouter);
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    return res.json({
        error:{
            message: error.message,
        }
    })
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
