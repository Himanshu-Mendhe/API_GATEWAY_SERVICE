const express = require('express');
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();
const {PORT} = require('./src/config/server-config');



app.use(morgan('combined'));
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

