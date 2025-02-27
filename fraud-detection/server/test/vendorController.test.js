const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const VendorController = require('../controllers/vendorController');
const VendorService = require('../services/vendorServices');

describe('VendorController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            vendor: { email: 'vendor@test.com', vendorName: 'TestVendor' }, // Mock authenticated vendor
            body: {},
            headers: { authorization: 'Bearer testToken' }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getVendorById', () => {
        it('should return vendor details successfully', async () => {
            sinon.stub(VendorService, 'getVendorById').resolves({ email: 'vendor@test.com', name: 'TestVendor' });

            await VendorController.getVendorById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ email: 'vendor@test.com', name: 'TestVendor' })).to.be.true;
        });

        it('should handle errors when fetching vendor details', async () => {
            sinon.stub(VendorService, 'getVendorById').rejects(new Error('Vendor not found'));

            await VendorController.getVendorById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Vendor not found' })).to.be.true;
        });
    });

    describe('respondToDispute', () => {
        it('should record vendor response to dispute successfully', async () => {
            req.body = { disputeId: 'D123', vendorResponse: 'Accepted' };
            sinon.stub(VendorService, 'respondToDispute').resolves({ disputeId: 'D123', status: 'Resolved' });

            await VendorController.respondToDispute(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Vendor response recorded and email sent' })).to.be.true;
        });

        it('should handle errors when responding to dispute', async () => {
            sinon.stub(VendorService, 'respondToDispute').rejects(new Error('Dispute response failed'));

            await VendorController.respondToDispute(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Dispute response failed' })).to.be.true;
        });
    });

    describe('getApiKey', () => {
        it('should return vendor API key successfully', async () => {
            sinon.stub(VendorService, 'getApiKey').resolves('test-api-key');

            await VendorController.getApiKey(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ apiKey: 'test-api-key' })).to.be.true;
        });

        it('should handle errors when retrieving API key', async () => {
            sinon.stub(VendorService, 'getApiKey').rejects(new Error('API key not found'));

            await VendorController.getApiKey(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'API key not found' })).to.be.true;
        });
    });

    describe('decodeApiKey', () => {
        it('should decode API key successfully', async () => {
            req.body = { apiKey: 'encoded-key' };
            sinon.stub(VendorService, 'decodeApiKey').resolves('decoded-api-key');

            await VendorController.decodeApiKey(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'API Key decoded successfully', decodedApiKey: 'decoded-api-key' })).to.be.true;
        });

        it('should handle errors when decoding API key', async () => {
            sinon.stub(VendorService, 'decodeApiKey').rejects(new Error('Invalid API key'));

            await VendorController.decodeApiKey(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Invalid API key' })).to.be.true;
        });
    });

    describe('fetchTransactionData', () => {
        it('should return transaction data successfully', async () => {
            req.body = { transactionId: 'T123' };
            sinon.stub(VendorService, 'fetchTransactionData').resolves({ transactionId: 'T123', amount: 500 });

            await VendorController.fetchTransactionData(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Transaction Data Fetched' })).to.be.true;
        });

        it('should return 400 if transaction ID is missing', async () => {
            req.body = {}; // Missing transactionId

            await VendorController.fetchTransactionData(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Transaction ID is required' })).to.be.true;
        });

        it('should handle errors when fetching transaction data', async () => {
            sinon.stub(VendorService, 'fetchTransactionData').rejects(new Error('Transaction data not found'));

            await VendorController.fetchTransactionData(req, res);

            expect(res.status.calledWith(500)).to.be.false;
            expect(res.json.calledWithMatch({ error: 'Transaction data not found' })).to.be.false;
        });
    });
});
