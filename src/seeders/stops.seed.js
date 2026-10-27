const STOPS = [
  { city: 'Casablanca', name: 'Casa Voyageurs' },
  { city: 'Casablanca', name: 'Casa Port' },
  { city: 'Rabat',      name: 'Rabat Ville' },
  { city: 'Marrakech',  name: 'Marrakech Gare' },
  { city: 'Fès',        name: 'Fès Gare' },
  { city: 'Tanger',     name: 'Tanger Ville' },
  { city: 'Agadir',     name: 'Agadir Gare' }
];

async function seedStops(Stop, City) {
  await Stop.deleteMany({});
  const cities = await City.find();
  const cityMap = Object.fromEntries(cities.map(c => [c.name, c._id]));
  return Stop.insertMany(
    STOPS.map(s => ({ cityId: cityMap[s.city], name: s.name }))
  );
}
module.exports = { seedStops };