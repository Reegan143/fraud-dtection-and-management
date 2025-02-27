const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const AdminController = require('../controllers/adminController');
const AdminService = require('../services/adminServices');

describe('AdminController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            admin: { adminId: '12345', email: 'admin@test.com' },
            vendor: { email: 'vendor@test.com' }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });


    describe('getAllDisputes', () => {
        it('should return disputes', async () => {
            sinon.stub(AdminService, 'getAllDisputes').resolves([{ id: '1', status: 'pending' }]);

            await AdminController.getAllDisputes(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ id: '1', status: 'pending' }])).to.be.true;
        });

        it('should handle error while fetching disputes', async () => {
            sinon.stub(AdminService, 'getAllDisputes').rejects(new Error('Database error'));

            await AdminController.getAllDisputes(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Database error' })).to.be.true;
        });
    });

    describe('requestApiKey', () => {
        it('should successfully request an API key', async () => {
            sinon.stub(AdminService, 'requestApiKey').resolves({ message: 'API Key Requested' });
            req.body = { transactionId: 'trans123' };

            await AdminController.requestApiKey(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'API Key Requested' })).to.be.true;
        });

        it('should handle error while requesting API key', async () => {
            sinon.stub(AdminService, 'requestApiKey').rejects(new Error('Request failed'));

            await AdminController.requestApiKey(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Request failed' })).to.be.true;
        });
    });

    describe('approveApiKeyRequest', () => {
        it('should approve an API key request', async () => {
            sinon.stub(AdminService, 'approveApiKeyRequest').resolves({ apiKey: 'test-api-key' });
            req.body = { requestId: 'req123', email: 'vendor@test.com', transactionId: 'trans123' };

            await AdminController.approveApiKeyRequest(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ apiKey: 'test-api-key' })).to.be.true;
        });

        it('should handle error in approving API key request', async () => {
            sinon.stub(AdminService, 'approveApiKeyRequest').rejects(new Error('Approval failed'));

            await AdminController.approveApiKeyRequest(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Approval failed' })).to.be.true;
        });
    });

    describe('rejectApiKeyRequest', () => {
        it('should reject an API key request successfully', async () => {
            sinon.stub(AdminService, 'rejectApiKeyRequest').resolves({ message: 'API Key rejected' });
            req.body = { requestId: 'req123' };

            await AdminController.rejectApiKeyRequest(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'API Key rejected' })).to.be.true;
        });

        it('should handle error when rejecting API key request', async () => {
            sinon.stub(AdminService, 'rejectApiKeyRequest').rejects(new Error('Rejection failed'));

            await AdminController.rejectApiKeyRequest(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Rejection failed' })).to.be.true;
        });
    });

    describe('getApiKeyRequests', () => {
        it('should return API key requests successfully', async () => {
            sinon.stub(AdminService, 'getApiKeyRequests').resolves([{ requestId: '1', status: 'pending' }]);

            await AdminController.getApiKeyRequests(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ requestId: '1', status: 'pending' }])).to.be.true;
        });

        it('should handle errors while fetching API key requests', async () => {
            sinon.stub(AdminService, 'getApiKeyRequests').rejects(new Error('Failed to fetch requests'));

            await AdminController.getApiKeyRequests(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Failed to fetch requests' })).to.be.true;
        });
    });

    describe('getTransactionById', () => {
        it('should return a transaction by ID', async () => {
            sinon.stub(AdminService, 'getTransactionById').resolves({ id: 'trans123', amount: 1000 });
            req.params = { transactionId: 'trans123' };

            await AdminController.getTransactionById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ id: 'trans123', amount: 1000 })).to.be.true;
        });

        it('should handle error if transaction not found', async () => {
            sinon.stub(AdminService, 'getTransactionById').rejects(new Error('Transaction not found'));

            await AdminController.getTransactionById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Transaction not found' })).to.be.true;
        });
    });
});
