const express = require('express');
const bodyParser = require('body-parser');

const route = express.Router();
const asyncHandler = require('express-async-handler');
const controller = require('../controller/controller');

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: false }));

// validate-rule
route.post('/validate-rule', asyncHandler((req, res) => controller.validateRule(req, res)));


module.exports = route;
