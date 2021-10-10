const express = require('express');
let router = express.Router();

const indexService = require('./../services/indexService')

// can import auth services as middle for routes
router.get('/', indexService.serveIndexPage);

// will re-name routes
router.get('/d3-js', indexService.serveD3Page);

router.get('/chart-js', indexService.serveIndexPage);

router.get('/service-report', indexService.getServiceReport);

module.exports = router;