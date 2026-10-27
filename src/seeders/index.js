const { seedCities } = require('./cities.seed');
const { seedStops }  = require('./stops.seed');

async function seedCatalogue() {
  const City = require('../models/city.model');
  const Stop = require('../models/stop.model');
  await seedCities(City);
  await seedStops(Stop, City);
}
module.exports = { seedCatalogue };    