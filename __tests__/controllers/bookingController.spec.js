import HTTPStatus from 'http-status';

import { create } from '../../src/controllers/booking.controller';
import Booking from '../../src/models/booking.model';
import Pilot from '../../src/models/pilot.model';

jest.mock('../../src/models/pilot.model', () => ({
    findOne: jest.fn()
}));

jest.mock('../../src/models/booking.model', () => ({
    createBooking: jest.fn(),
    isAlreadyBooked: jest.fn()
}));

const mockReq = {
    body: {
        pilotId: 'testPilotId',
        depDateTime: '2021-05-16T09:00:00',
        returnDateTime: '2021-05-16T11:00:00Z'
    }
};

const mockPilot = {
    _id: 'testId',
    WorkDays: ['Monday', 'Friday', 'Sunday']
};

describe('Booking Controller', () => {
    let returnJsonMockFn;
    describe('create', () => {
        it('should create a booking with the correct ID and epoch timestamps', async () => {
            returnJsonMockFn = jest.fn();

            Pilot.findOne.mockImplementation((params) => (params.ID === 'testPilotId' ? mockPilot : 'fail'));
            Booking.createBooking.mockImplementation((pilot, departTimestamp, returnTimestamp) => {
                if (pilot === mockPilot && departTimestamp === 1621152000 && returnTimestamp === 1621162800) {
                    return Promise.resolve({ mockBooking: 'mockBookingData' });
                }
            });
            Booking.isAlreadyBooked.mockReturnValue(Promise.resolve(false));

            const res = {
                status: () => ({
                    json: returnJsonMockFn
                })
            };
            const next = jest.fn();

            await create(mockReq, res, next);

            expect(returnJsonMockFn).toHaveBeenCalledWith({ mockBooking: 'mockBookingData' });
        });

        it('should return an error when there is an error from the Pilot model call', async () => {
            Pilot.findOne.mockImplementation(() => { throw new Error('mockPilotError') });

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await create(mockReq, null, next);

            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
            expect(returnedError.message).toBe('mockPilotError');
        });

        it('should return an error when there is an error from the Booking isAlreadyBooked model call', async () => {
            returnJsonMockFn = jest.fn();

            Pilot.findOne.mockImplementation((params) => (params.ID === 'testPilotId' ? mockPilot : 'fail'));
            Booking.isAlreadyBooked.mockImplementation(() => { throw new Error('mockAvailibilityError') });

            const mockRes = {
                status: () => ({
                    json: returnJsonMockFn
                })
            };

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await create(mockReq, mockRes, next);

            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
            expect(returnedError.message).toBe('mockAvailibilityError');
        });

        it('should return an error when there is an error from the createBooking model call', async () => {
            returnJsonMockFn = jest.fn();

            Pilot.findOne.mockImplementation((params) => (params.ID === 'testPilotId' ? mockPilot : 'fail'));
            Booking.createBooking.mockImplementation(() => { throw new Error('mockBookingError') });
            Booking.isAlreadyBooked.mockReturnValue(Promise.resolve(false));

            const mockRes = {
                status: () => ({
                    json: returnJsonMockFn
                })
            };

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await create(mockReq, mockRes, next);

            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
            expect(returnedError.message).toBe('mockBookingError');
        });
    });
});