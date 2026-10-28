const express = require('express');

module.exports = (deps) => {
  const router = express.Router();
  router.use('/lines', require('./line.routes')(deps));
  router.use('/coaches', require('./coach.routes')(deps));
  router.use('/departures', require('./departure.routes')(deps));
  return router;
};