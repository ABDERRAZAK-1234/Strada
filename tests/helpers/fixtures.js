const mongoose = require('mongoose');
const { authHeader } = require('./auth-helpers');



let counter = 0;

function nextNumber() {
  counter += 1;
  return counter;
}

function inHours(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function requireStatus(response, expectedStatus, label) {
  if (response.status !== expectedStatus) {
    throw new Error(
      label + ' failed: expected ' + expectedStatus + ' but got ' + response.status + ' ' + JSON.stringify(response.body)
    );
  }
}

function expectError(response, expectedStatus, expectedCode) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body.error.code).toBe(expectedCode);
}


async function createLine(api, adminToken) {
  const stopsResponse = await api.get('/api/v1/stops');
  requireStatus(stopsResponse, 200, 'List stops');
  const stops = stopsResponse.body.data;

  const response = await api
    .post('/api/v1/lines')
    .set(authHeader(adminToken))
    .send({
      code: 'LINE-' + nextNumber(),
      label: 'Test line',
      stopIds: [stops[0].id, stops[1].id],
    });
  requireStatus(response, 201, 'Create line');

  return response.body.data;
}

async function createCoach(api, adminToken) {
  const response = await api
    .post('/api/v1/coaches')
    .set(authHeader(adminToken))
    .send({
      registration: 'COACH-' + nextNumber(),
      seatNumbers: [1, 2, 3, 4],
    });
  requireStatus(response, 201, 'Create coach');

  return response.body.data;
}

async function createDeparture(api, adminToken) {
  const line = await createLine(api, adminToken);
  const coach = await createCoach(api, adminToken);

  const response = await api
    .post('/api/v1/departures')
    .set(authHeader(adminToken))
    .send({
      lineId: line.id,
      coachId: coach.id,
      departureAt: inHours(48),
      arrivalAt: inHours(49),
      fareCents: 5000,
    });
  requireStatus(response, 201, 'Create departure');

  return response.body.data;
}


async function createBooking(api, passengerToken, departureId, seatNumber) {
  const response = await api
    .post('/api/v1/departures/' + departureId + '/bookings')
    .set(authHeader(passengerToken))
    .send({ seatNumber: seatNumber });
  requireStatus(response, 201, 'Create booking');

  return response.body.data;
}

async function cancelBooking(api, passengerToken, bookingId) {
  const response = await api
    .post('/api/v1/bookings/' + bookingId + '/cancel')
    .set(authHeader(passengerToken));
  requireStatus(response, 200, 'Cancel booking');

  return response.body.data;
}

async function getBooking(api, token, bookingId) {
  const response = await api
    .get('/api/v1/bookings/' + bookingId)
    .set(authHeader(token));
  requireStatus(response, 200, 'Get booking');

  return response.body.data;
}


async function openBoarding(api, agentToken, departureId) {
  const response = await api
    .post('/api/v1/departures/' + departureId + '/start-boarding')
    .set(authHeader(agentToken));
  requireStatus(response, 200, 'Start boarding');
}

async function departDeparture(api, agentToken, departureId) {
  const response = await api
    .post('/api/v1/departures/' + departureId + '/depart')
    .set(authHeader(agentToken));
  requireStatus(response, 200, 'Depart');
}

function scanTicket(api, agentToken, departureId, ticketCode) {
  return api
    .post('/api/v1/departures/' + departureId + '/boarding-records')
    .set(authHeader(agentToken))
    .send({ ticketCode: ticketCode });
}

function cancelDeparture(api, adminToken, departureId) {
  return api
    .post('/api/v1/departures/' + departureId + '/cancel')
    .set(authHeader(adminToken));
}

async function createTicketReadyToScan(api, tokens, seatNumber = 2) {
  const departure = await createDeparture(api, tokens.admin);
  const booking = await createBooking(api, tokens.passenger1, departure.id, seatNumber);
  await openBoarding(api, tokens.agent, departure.id);

  return {
    departureId: departure.id,
    bookingId: booking.id,
    ticketCode: booking.ticketCode,
  };
}

function countBoardingRecords() {
  return mongoose.connection.collection('boardingrecords').countDocuments();
}

module.exports = {
  inHours,
  requireStatus,
  expectError,
  createLine,
  createCoach,
  createDeparture,
  createBooking,
  cancelBooking,
  getBooking,
  openBoarding,
  departDeparture,
  scanTicket,
  cancelDeparture,
  createTicketReadyToScan,
  countBoardingRecords,
};
