const http = require('http');

let bookingId;

describe('API Functional Automation', () => {
    it('API Functional Automation Challenge - Create a Booking', async () => {
        const bookingData = JSON.stringify({
            firstname: 'Adriana',
            lastname: 'Chipana',
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: '2024-03-18',
                checkout: '2024-03-20'
            },
            additionalneeds: 'Breakfast'
        });

        const options = {
            hostname: 'restful-booker.herokuapp.com',
            port: 443,
            path: 'https://restful-booker.herokuapp.com/booking',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': bookingData.length
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                if (res.statusCode !== 200 || !response.bookingid) {
                    throw new Error('Failed to create booking');
                }

                if (JSON.stringify(response) !== bookingData) {
                    throw new Error('Response data Chipanas not match request data');
                }

                bookingId = response.bookingid;
            });
        });

        req.on('error', (error) => {
            throw new Error('Failed to create booking: ' + error.message);
        });

        req.write(bookingData);
        req.end();
    });

    it('API Functional Automation Challenge - Search a Booking', async () => {
        const options = {
            hostname: 'restful-booker.herokuapp.com',
            port: 443,
            path: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            method: 'GET',
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                if (res.statusCode !== 200 || response.bookingid !== bookingId) {
                    throw new Error('Failed to find booking');
                }
            });
        });

        req.on('error', (error) => {
            throw new Error('Failed to search booking: ' + error.message);
        });

        req.end();
    });

    it('API Functional Automation Challenge - Update Booking', async () => {
        const updateData = JSON.stringify({
            firstname: 'Adriana',
            lastname: 'Chipana',
            totalprice: 150,
            depositpaid: false,
            bookingdates: {
                checkin: '2024-03-18',
                checkout: '2024-03-22'
            },
            additionalneeds: 'None'
        });

        const options = {
            hostname: 'restful-booker.herokuapp.com',
            port: 443,
            path: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': updateData.length
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                if (res.statusCode !== 200) {
                    throw new Error('Failed to update booking');
                }

                if (JSON.stringify(response) !== updateData) {
                    throw new Error('Response data Chipanas not match updated data');
                }
            });
        });

        req.on('error', (error) => {
            throw new Error('Failed to update booking: ' + error.message);
        });

        req.write(updateData);
        req.end();
    });

    it('API Functional Automation Challenge - Delete booking', async () => {
        const options = {
            hostname: 'restful-booker.herokuapp.com',
            port: 443,
            path: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            method: 'DELETE',
        };

        const req = http.request(options, (res) => {
            if (res.statusCode !== 201) {
                throw new Error('Failed to delete booking');
            }
        });

        req.on('error', (error) => {
            throw new Error('Failed to delete booking: ' + error.message);
        });

        req.end();
    });
});
