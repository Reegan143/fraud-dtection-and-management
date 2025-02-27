const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const AdminService = require('../services/adminServices');
const AdminRepository = require('../repositories/adminRepository');
const UserRepository = require('../repositories/userRepository');
const TransactionRepository = require('../repositories/transactionRepository');
const NotificationRepository = require('../repositories/notificationRepository');
const { sendMail } = require('../utils/sendMail');
const nodemailer = require('nodemailer');
const axios = require('axios');

describe('AdminService Tests', () => {
    afterEach(() => {
        sinon.restore();
    });


    describe('requestApiKey', () => {
        it('should successfully request an API key', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves({ email: 'vendor@test.com', vendorName: 'TestVendor', transactions: [{ transactionId: 'T123' }] });
            sinon.stub(AdminRepository, 'findApiKeyRequestByTransactionId').resolves([]);
            sinon.stub(AdminRepository, 'createApiKeyRequest').resolves();

            const result = await AdminService.requestApiKey('T123', 'vendor@test.com');

            expect(result.message).to.equal('API key request submitted. Awaiting admin approval.');
        });

        it('should throw an error if vendor is not found', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves(null);

            try {
                await AdminService.requestApiKey('T123', 'vendor@test.com');
            } catch (error) {
                expect(error.message).to.equal('Vendor not found');
            }
        });

        it('should throw an error if API key request is already pending', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves({ email: 'vendor@test.com', vendorName: 'TestVendor', transactions: [{ transactionId: 'T123' }] });
            sinon.stub(AdminRepository, 'findApiKeyRequestByTransactionId').resolves([{ status: 'pending' }]);

            try {
                await AdminService.requestApiKey('T123', 'vendor@test.com');
            } catch (error) {
                expect(error.message).to.equal('API key request is already pending');
            }
        });
    });

    describe('approveApiKeyRequest', () => {
        it('should approve an API key request', async () => {
            sinon.stub(AdminRepository, 'findApiKeyRequest').resolves({ status: 'pending' });
            sinon.stub(UserRepository, 'findUserByEmail').resolves({ vendorName: 'TestVendor', apiKey: [], save: sinon.stub() });
            sinon.stub(axios, 'post').resolves({ data: { apiKey: 'generated-api-key' } });
            sinon.stub(AdminRepository, 'updateApiKeyRequest').resolves();
            sinon.stub(AdminRepository, 'findAndDeleteApiKeyRequest').resolves();

            const result = await AdminService.approveApiKeyRequest('REQ123', 'vendor@test.com', 'T123');

            expect(result).to.have.property('apiKey');
        });

        it('should throw an error if no pending API key request is found', async () => {
            sinon.stub(AdminRepository, 'findApiKeyRequest').resolves(null);

            try {
                await AdminService.approveApiKeyRequest('REQ123', 'vendor@test.com', 'T123');
            } catch (error) {
                expect(error.message).to.equal('No pending API key request found for this vendor');
            }
        });
    });

    describe('rejectApiKeyRequest', () => {
        it('should reject an API key request', async () => {
            sinon.stub(AdminRepository, 'findApiKeyRequest').resolves({ status: 'pending' });
            sinon.stub(AdminRepository, 'updateApiKeyRequest').resolves();

            const result = await AdminService.rejectApiKeyRequest('REQ123');

            expect(result.message).to.equal('API key request rejected');
        });

        it('should throw an error if no pending API key request is found', async () => {
            sinon.stub(AdminRepository, 'findApiKeyRequest').resolves(null);

            try {
                await AdminService.rejectApiKeyRequest('REQ123');
            } catch (error) {
                expect(error.message).to.equal('No pending API key request found for this vendor');
            }
        });
    });

    describe('generateFraudReport', () => {
        it('should generate a fraud report successfully', async () => {
            sinon.stub(AdminRepository, 'generateFraudReport').resolves([{ id: 'R1', amount: 1000 }]);
            sinon.stub(nodemailer, 'createTransport').returns({
                sendMail: sinon.stub().resolves(),
            });

            const result = await AdminService.generateFraudReport('2024-01-01', '2024-01-31', 'admin@test.com');

            expect(result).to.be.an('array');
            expect(result[0]).to.have.property('id');
        });
    });
});
