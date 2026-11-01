import { AppError } from '../../../shared/errors/AppError.js';



export class ReservationsService {
    constructor({
        bookingRepository,
        catalogueApi,
        clock,
        ticketCodeGenerator,
        transactionRunner
    }) {
        this.bookingRepository = bookingRepository;
        this.catalogueApi = catalogueApi;
        this.clock = clock;
        this.ticketCodeGenerator = ticketCodeGenerator;
        this.transactionRunner = transactionRunner;
    }

    async createBooking({ departureId, seatNumber, user }) {
        return await this.transactionRunner.run(async (session) => {

            const departure = await this.catalogueApi.getDeparture(departureId, session)
            if (!departure) {
                throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Departure not found')
            }
            if (departure.status !== 'OPEN') {
                throw new AppError(409, 'DEPARTURE_NOT_BOOKABLE', 'Departure is not open for booking')
            }

            const depTime = new Date(departure.departureTime || departure.departureAt)
            if (depTime <= this.clock.now()) {
                throw new AppError(409, 'DEPARTURE_NOT_BOOKABLE', 'Departure time has passed')
            }

            const seatPlan = departure.snapshot?.seatPlan || departure.snapshot?.seatNumbers || [];
            if (!seatPlan.includes(seatNumber)) {
                throw new AppError(400, 'SEAT_NOT_IN_PLAN', 'Seat number does not exist on this coach')
            }

            const existingUserBooking = await this.bookingRepository.findActiveByDepartureAndPassenger(departureId, user.userId, session)
            if (existingUserBooking) {
                throw new AppError(409, 'ALREADY_BOOKED', 'Passenger already has an active booking for this departure');
            }

            const occupied = await this.bookingRepository.findActiveByDepartureAndSeat(departureId, seatNumber, session);
            if (occupied) {
                throw new AppError(409, 'SEAT_UNAVAILABLE', 'Seat is already occupied');
            }

            const ticketCode = this.ticketCodeGenerator.generate();
            const bookingData = {
                departureId,
                passengerId: user.userId,
                passengerName: user.fullName,
                seatNumber,
                priceCents: departure.fareCents,
                status: 'CONFIRMED',
                occupiesSeat: true,
                ticketCode
            }
            const booking = await this.bookingRepository.create(bookingData, session)

            return {
                id: booking._id,
                departureId: booking.departureId,
                seatNumber: booking.seatNumber,
                passengerName: booking.passengerName,
                priceCents: booking.priceCents,
                status: booking.status,
                ticketCode: booking.ticketCode
            };

        })
    }
}