import HTTPStatus from 'http-status';

import { create, getAvailability } from '../../src/controllers/pilot.controller';
import Booking from '../../src/models/booking.model';
import Pilot from '../../src/models/pilot.model';

jest.mock('../../src/models/pilot.model', () => ({
    createPilot: jest.fn(),
    getPilotsForBase: jest.fn()
}));

jest.mock('../../src/models/booking.model', () => ({
    getBookingsBetween: jest.fn()
}));

const mockCreateReq = {
    body: {
        ID: 'mockId',
        Name: 'mockName',
        Base: 'mockBase',
        WorkDays: ['mockDay', 'mockDay2']
    }
};

describe('Pilot controller', () => {
    describe('create', () => {
        it('should create a pilot', async () => {
            const res = {
                status: () => ({
                    send: jest.fn()
                })
            };

            const { ID, Name, Base, WorkDays } = mockCreateReq.body;

            Pilot.createPilot.mockImplementation((id, name, base, workDays) => {
                if (id === ID
                    && name === Name
                    && base === Base
                    && workDays === WorkDays) {
                    return Promise.resolve('Mock Pilot Created!')
                }
                return Promise.reject('fail');
            });

            await create(mockCreateReq, res, null);
        });

        it('should return an error if the pilot creation is not successful', async () => {
            Pilot.createPilot.mockImplementation(() => { throw new Error('mockPilotError') });

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await create(mockCreateReq, null, next)

            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
            expect(returnedError.message).toBe('mockPilotError');
        });
    });

    describe('getAvailability', () => {
        const mockBookings = [{ pilot: 1 }];

        let mockReturnAvailabilityCallback;

        it('should return the correct first pilot from the list of available pilots', async () => {
            mockReturnAvailabilityCallback = jest.fn();

            const mockGetAvailabilityReq = {
                query: {
                    location: 'mockLocation',
                    depDateTime: '2025-05-23T09:00:00',
                    returnDateTime: '2025-05-23T11:00:00Z',
                }
            };

            const mockRes = {
                status: () => ({
                    send: mockReturnAvailabilityCallback
                })
            }

            Booking.getBookingsBetween.mockImplementation((startTime, endTime) => {
                if (startTime === 1747987200 && endTime === 1747998000) {
                    return Promise.resolve(mockBookings);
                }
                return Promise.reject('fail');
            });

            Pilot.getPilotsForBase.mockImplementation((location, bookedPilotIds, weekdayOfFlight) => {
                if (location === 'mockLocation'
                    && bookedPilotIds.length === 1
                    && bookedPilotIds[0] === 1
                    && weekdayOfFlight === 'Friday') {
                    return Promise.resolve([
                        { mockPilot1: 'mockPilotData1' },
                        { mockPilot2: 'mockPilotData2' },
                        { mockPilot3: 'mockPilotData3' },
                    ]);
                }
                return Promise.reject('fail');
            });

            await getAvailability(mockGetAvailabilityReq, mockRes, jest.fn());

            expect(mockReturnAvailabilityCallback).toBeCalledWith({
                pilot: {
                    mockPilot1: 'mockPilotData1'
                }
            });
        });

        it('should return an error if the departure time is in the past', async () => {
            const mockGetAvailabilityReq = {
                query: {
                    location: 'mockLocation',
                    depDateTime: '2000-05-23T09:00:00',
                    returnDateTime: '2025-05-23T11:00:00Z',
                }
            };

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await getAvailability(mockGetAvailabilityReq, null, next);

            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
            expect(returnedError.message).toBe('Availability checks must be for the future');
        });

        it('should return an error if the return time is in the past', async () => {
            const mockGetAvailabilityReq = {
                query: {
                    location: 'mockLocation',
                    depDateTime: '2025-05-23T09:00:00',
                    returnDateTime: '2000-05-23T11:00:00Z',
                }
            };

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await getAvailability(mockGetAvailabilityReq, null, next);

            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
            expect(returnedError.message).toBe('Availability checks must be for the future');
        });

        it('should return an error if the Booking model call fails', async () => {
            const mockGetAvailabilityReq = {
                query: {
                    location: 'mockLocation',
                    depDateTime: '2025-05-23T09:00:00',
                    returnDateTime: '2025-05-23T11:00:00Z',
                }
            };

            Booking.getBookingsBetween.mockImplementation(() => {
                throw new Error('mockBookingError');
            });

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await getAvailability(mockGetAvailabilityReq, null, next);

            expect(returnedError.message).toBe('mockBookingError')
            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
        });

        it('should return an error if the Pilot model call fails', async () => {
            const mockGetAvailabilityReq = {
                query: {
                    location: 'mockLocation',
                    depDateTime: '2025-05-23T09:00:00',
                    returnDateTime: '2025-05-23T11:00:00Z',
                }
            };

            Booking.getBookingsBetween.mockImplementation((startTime, endTime) => {
                if (startTime === 1747987200 && endTime === 1747998000) {
                    return Promise.resolve(mockBookings);
                }
                return Promise.reject('fail');
            });

            Pilot.getPilotsForBase.mockImplementation(() => {
                throw new Error('mockPilotError');
            });

            let returnedError;
            const next = jest.fn(err => {
                returnedError = err;
            });

            await getAvailability(mockGetAvailabilityReq, null, next);

            expect(returnedError.message).toBe('mockPilotError')
            expect(returnedError.status).toBe(HTTPStatus.BAD_REQUEST);
        });
    });
}); 