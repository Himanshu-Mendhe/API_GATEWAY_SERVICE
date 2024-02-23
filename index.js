const express = require('express');
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios'); 

const app = express();
const {PORT} = require('./src/config/server-config');

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 2 minutes).
})


app.use(morgan('combined'));
app.use(limiter);
app.use('/bookingservice', async(req, res, next) => {
    console.log(req.headers['x-access-token']);

    try {
        const response = await axios.get('http://localhost:3002/api/v1/isauthenticated', {
            headers: {
                'x-access-token' : req.headers['x-access-token']
            }
        })
        console.log(response.data);
        console.log('hii');
        if (response.data.success){
            next();       
        }else {
            return res.status(401).json({
                message: 'unauthorised' 
            })
        }
    } catch (error) {
        return res.status(401).json({
            message: 'unauthorised' 
        })
    }
})
app.use('/bookingservice', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true}));
// means anything hitting on 3005 will redirect tpo 3003;
app.get('/home', async(req,res) => {
    res.status(200).json({
        message: 'success'
    })
})

app.listen(PORT, () => {
    console.log(`server started on port --${PORT}--`);
})

