const express = require('express');

const app = express();

// routes
let _routes = require('../controllers/index')

app.use(_routes)

module.exports = app