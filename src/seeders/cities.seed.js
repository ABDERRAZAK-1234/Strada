const CITIES = [
  { name: 'Casablanca' },
  { name: 'Rabat' },
  { name: 'Marrakech' },
  { name: 'Fès' },
  { name: 'Tanger' },
  { name: 'Agadir' }
];

async function seedCities(City) {
  await City.deleteMany({});
  return City.insertMany(CITIES);
}
module.exports = { seedCities };