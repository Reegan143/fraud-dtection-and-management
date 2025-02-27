const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const axios = require('axios');
const jwt = require('jsonwebtoken');
const VendorService = require('../services/vendorServices');
const VendorRepository = require('../repositories/vendorRepository');
const UserRepository = require('../repositories/userRepository');
const { sendMail } = require('../utils/sendMail');

describe('VendorService Tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getVendorById', () => {
        it('should return vendor details if found', async () => {
            const mockVendor = { email: 'vendor@example.com', vendorName: 'TestVendor' };
            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(mockVendor);

            const result = await VendorService.getVendorById('vendor@example.com');

            expect(result).to.deep.equal(mockVendor);
        });

        it('should throw an error if vendor is not found', async () => {
            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(null);

            try {
                await VendorService.getVendorById('vendor@example.com');
            } catch (error) {
                expect(error.message).to.equal('Vendor not found');
            }
        });
    });

    describe('respondToDispute', () => {
        it('should successfully respond to a dispute', async () => {
            const mockDispute = { email: 'user@example.com', ticketNumber: '1234', amount: 100, vendorResponse: null, status: 'open' };
            const mockUser = { email: 'user@example.com', userName: 'John Doe' };

            sinon.stub(VendorRepository, 'findDisputeById').resolves(mockDispute);
            sinon.stub(UserRepository, 'findUserByEmail').resolves(mockUser);
            sinon.stub(VendorRepository, 'saveDispute').resolves();
            sinon.stub(VendorRepository, 'createNotification').resolves();

            const result = await VendorService.respondToDispute('dispute123', 'Resolved by vendor');

            expect(result.vendorResponse).to.equal('Resolved by vendor');
            expect(result.status).to.equal('closed');
        });

        it('should throw an error if dispute is not found', async () => {
            sinon.stub(VendorRepository, 'findDisputeById').resolves(null);

            try {
                await VendorService.respondToDispute('dispute123', 'Resolved by vendor');
            } catch (error) {
                expect(error.message).to.equal('Dispute not found');
            }
        });

        it('should throw an error if response is already submitted', async () => {
            const mockDispute = { vendorResponse: 'Already resolved' };
            sinon.stub(VendorRepository, 'findDisputeById').resolves(mockDispute);
            try {
                await VendorService.respondToDispute('dispute123', 'New response');
            } catch (error) {
                expect(error.message).to.equal('Response already submitted for this dispute');
            }
        });
    });

    describe('getApiKey', () => {
        it('should return API key if vendor exists', async () => {
            const mockVendor = { email: 'vendor@example.com', apiKey: 'test-api-key' };
            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(mockVendor);

            const result = await VendorService.getApiKey('vendor@example.com');

            expect(result).to.equal('test-api-key');
        });

        it('should throw an error if API key is not found', async () => {
            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(null);

            try {
                await VendorService.getApiKey('vendor@example.com');
            } catch (error) {
                expect(error.message).to.equal('API Key not found');
            }
        });
    });

    describe('fetchTransactionData', () => {
        it('should fetch transaction data successfully', async () => {
            const mockVendor = { vendorName: 'TestVendor', apiKey: 'test-api-key' };
            const mockTransaction = { transactionId: '123456', amount: 100 };

            sinon.stub(VendorRepository, 'findVendorByName').resolves(mockVendor);
            sinon.stub(axios, 'get').resolves({ data: mockTransaction });

            const result = await VendorService.fetchTransactionData('TestVendor', '123456', 'Bearer mocktoken');

            expect(result).to.deep.equal(mockTransaction);
        });

        it('should throw an error if vendor API key is not found', async () => {
            sinon.stub(VendorRepository, 'findVendorByName').resolves(null);

            try {
                await VendorService.fetchTransactionData('TestVendor', '123456', 'Bearer mocktoken');
            } catch (error) {
                expect(error.message).to.equal('API Key not found. Please request an API Key first.');
            }
        });
    });

    describe('decodeApiKey', () => {
        it('should decode a valid API key', async () => {
            const mockVendor = { vendorName: 'TestVendor', apiKey: 'test-api-key' };
            const mockDecodedData = { vendorId: 'vendor123' };

            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(mockVendor);
            sinon.stub(jwt, 'verify').returns(mockDecodedData);

            const result = await VendorService.decodeApiKey('test-api-key', 'vendor@example.com');

            expect(result).to.deep.equal(mockDecodedData);
        });

        it('should throw an error if API key is not valid', async () => {
            const mockVendor = { vendorName: 'TestVendor', apiKey: 'test-api-key' };
            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(mockVendor);
            sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

            try {
                await VendorService.decodeApiKey('invalid-api-key', 'vendor@example.com');
            } catch (error) {
                expect(error.message).to.equal('Invalid token');
            }
        });

        it('should throw an error if vendor API key is not found', async () => {
            sinon.stub(VendorRepository, 'findVendorByEmail').resolves(null);

            try {
                await VendorService.decodeApiKey('test-api-key', 'vendor@example.com');
            } catch (error) {
                expect(error.message).to.equal('API Key not found. Please request an API Key first.');
            }
        });
    });
});
