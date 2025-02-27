const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const mongoose = require('mongoose');

const AdminRepository = require('../repositories/adminRepository');
const DisputesModel = require('../models/disputeModel');
const ApiModel = require('../models/apiModel');
const DisputesRepository = require('../repositories/disputesRepository');
const UserModel = require('../models/userModel');

describe('AdminRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset all mocks after each test 
    });



    describe('getAllDisputes', () => {
        it('should return all disputes', async () => {
            const mockDisputes = [{ id: '1', status: 'pending' }];
            sinon.stub(DisputesRepository, 'getAllDisputes').resolves(mockDisputes);

            const result = await AdminRepository.getAllDisputes();
            expect(result).to.deep.equal(mockDisputes);
        });
    });

    describe('findAdminByEmail', () => {
        it('should find admin by email', async () => {
            const mockAdmin = { email: 'admin@example.com'};
            sinon.stub(UserModel, 'findOne').resolves(mockAdmin);

            const result = await AdminRepository.findAdminByEmail('admin@example.com');
            expect(result).to.deep.equal(mockAdmin);
        });

        it('should return null if admin not found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await AdminRepository.findAdminByEmail('admin@example.com');
            expect(result).to.be.null;
        });
    });


    describe('findApiKeyRequest', () => {
        it('should find an API key request', async () => {
            const mockRequest = { _id: 'request123', status: 'pending' };
            sinon.stub(ApiModel, 'findOne').resolves(mockRequest);

            const result = await AdminRepository.findApiKeyRequest('request123');
            expect(result).to.deep.equal(mockRequest);
        });
    });

    describe('updateApiKeyRequest', () => {
        it('should update API key request status', async () => {
            const mockUpdatedRequest = { _id: 'request123', status: 'approved' };
            sinon.stub(ApiModel, 'findOneAndUpdate').resolves(mockUpdatedRequest);

            const result = await AdminRepository.updateApiKeyRequest('request123', 'approved');
            expect(result).to.deep.equal(mockUpdatedRequest);
        });
    });

    describe('findAndDeleteApiKeyRequest', () => {
        it('should delete an API key request', async () => {
            const mockRequest = { _id: 'request123', status: 'pending' };
            sinon.stub(ApiModel, 'findByIdAndDelete').resolves(mockRequest);

            const result = await AdminRepository.findAndDeleteApiKeyRequest('request123');
            expect(result).to.deep.equal(mockRequest);
        });
    });

    describe('createApiKeyRequest', () => {
        it('should create a new API key request', async () => {
            const mockRequest = { vendorName: 'TestVendor', transactionId: 'trans123', status: 'pending' };
            sinon.stub(ApiModel, 'create').resolves(mockRequest);

            const result = await AdminRepository.createApiKeyRequest(mockRequest);
            expect(result).to.deep.equal(mockRequest);
        });
    });

    describe('getAllApiKeyRequests', () => {
        it('should return all API key requests', async () => {
            const mockRequests = [{ vendorName: 'Vendor1', status: 'pending' }];
            sinon.stub(ApiModel, 'find').resolves(mockRequests);

            const result = await AdminRepository.getAllApiKeyRequests();
            expect(result).to.deep.equal(mockRequests);
        });
    });

    describe('updateDisputeStatus', () => {
        it('should update dispute status', async () => {
            const mockDispute = { id: 'dispute123', status: 'pending' };
            sinon.stub(DisputesRepository, 'getDisputeById').resolves(mockDispute);
            sinon.stub(DisputesRepository, 'updateById').resolves({ id: 'dispute123', status: 'resolved' });

            const result = await AdminRepository.updateDisputeStatus('dispute123', 'resolved', 'Issue fixed', 'admin123');
            expect(result.status).to.equal('resolved');
        });

        it('should throw an error if dispute not found', async () => {
            sinon.stub(DisputesRepository, 'getDisputeById').resolves(null);

            try {
                await AdminRepository.updateDisputeStatus('dispute123', 'resolved', 'Issue fixed', 'admin123');
            } catch (error) {
                expect(error.message).to.equal('Dispute not found');
            }
        });

        it('should throw an error if dispute is already resolved', async () => {
            const mockDispute = { id: 'dispute123', status: 'Resolved' };
            sinon.stub(DisputesRepository, 'getDisputeById').resolves(mockDispute);

            try {
                await AdminRepository.updateDisputeStatus('dispute123', 'resolved', 'Issue fixed', 'admin123');
            } catch (error) {
                expect(error.message).to.equal('Dispute already resolved');
            }
        });
    });

    describe('generateFraudReport', () => {
        it('should generate fraud report', async () => {
            const mockReport = [
                { _id: 'fraud', count: 5, totalAmount: 5000 }
            ];
            sinon.stub(DisputesModel, 'aggregate').resolves(mockReport);

            const result = await AdminRepository.generateFraudReport('2024-01-01', '2024-02-01');
            expect(result).to.deep.equal(mockReport);
        });
    });
});
