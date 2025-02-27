const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const DisputesRepository = require('../repositories/disputesRepository');
const DisputesModel = require('../models/disputeModel');
const UserModel = require('../models/userModel');
const TransactionModel = require('../models/tranasactionModel');

describe('DisputesRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset mocks after each test
    });

    describe('createDispute', () => {
        it('should create a dispute successfully', async () => {
            const mockDispute = { transactionId: '12345', complaintType: 'Unauthorized Transaction' };
            sinon.stub(DisputesModel, 'create').resolves(mockDispute);

            const result = await DisputesRepository.createDispute(mockDispute);
            expect(result).to.deep.equal(mockDispute);
        });
    });

    describe('findDisputeByTransactionId', () => {
        it('should find dispute by transaction ID', async () => {
            const mockDispute = { transactionId: '12345', status: 'pending' };
            sinon.stub(DisputesModel, 'findOne').resolves(mockDispute);

            const result = await DisputesRepository.findDisputeByTransactionId('12345');
            expect(result).to.deep.equal(mockDispute);
        });

        it('should return null if no dispute found', async () => {
            sinon.stub(DisputesModel, 'findOne').resolves(null);

            const result = await DisputesRepository.findDisputeByTransactionId('99999');
            expect(result).to.be.null;
        });
    });

    describe('findTransactionById', () => {
        it('should find transaction by ID', async () => {
            const mockTransaction = { transactionId: '98765', amount: 500 };
            sinon.stub(TransactionModel, 'findOne').resolves(mockTransaction);

            const result = await DisputesRepository.findTransactionById('98765');
            expect(result).to.deep.equal(mockTransaction);
        });

        it('should return null if transaction not found', async () => {
            sinon.stub(TransactionModel, 'findOne').resolves(null);

            const result = await DisputesRepository.findTransactionById('99999');
            expect(result).to.be.null;
        });
    });

    describe('findUserByDebitCard', () => {
        it('should find user by debit card number', async () => {
            const mockUser = { email: 'user@test.com', debitCardNumber: '1234567890123456' };
            sinon.stub(UserModel, 'findOne').resolves(mockUser);

            const result = await DisputesRepository.findUserByDebitCard('1234567890123456');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if no user found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await DisputesRepository.findUserByDebitCard('0000000000000000');
            expect(result).to.be.null;
        });
    });

    describe('findAdmin', () => {
        it('should find an admin user', async () => {
            const mockAdmin = { email: 'admin@test.com', role: 'admin' };
            sinon.stub(UserModel, 'findOne').resolves(mockAdmin);

            const result = await DisputesRepository.findAdmin();
            expect(result).to.deep.equal(mockAdmin);
        });

        it('should return null if no admin found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await DisputesRepository.findAdmin();
            expect(result).to.be.null;
        });
    });

    describe('getAllDisputes', () => {
        it('should return all disputes', async () => {
            const mockDisputes = [{ id: '1', status: 'pending' }];
            sinon.stub(DisputesModel, 'find').resolves(mockDisputes);

            const result = await DisputesRepository.getAllDisputes();
            expect(result).to.deep.equal(mockDisputes);
        });
    });

    describe('getUserDisputes', () => {
        it('should return disputes for a given user', async () => {
            const mockDisputes = [{ id: '1', email: 'user@test.com', status: 'pending' }];
            sinon.stub(DisputesModel, 'find').resolves(mockDisputes);

            const result = await DisputesRepository.getUserDisputes('user@test.com');
            expect(result).to.deep.equal(mockDisputes);
        });
    });

    describe('getDisputeById', () => {
        it('should return a dispute by ID', async () => {
            const mockDispute = { id: '1', status: 'pending' };
            sinon.stub(DisputesModel, 'findById').resolves(mockDispute);

            const result = await DisputesRepository.getDisputeById('1');
            expect(result).to.deep.equal(mockDispute);
        });
    });

    describe('generateUniqueTicketNumber', () => {
        it('should generate a unique ticket number', async () => {
            sinon.stub(DisputesModel, 'exists').resolves(false);

            const result = await DisputesRepository.generateUniqueTicketNumber();
            expect(result).to.be.a('number').and.to.be.gte(100000).and.to.be.lte(999999);
        });
    });

    describe('updateById', () => {
        it('should update dispute status by ID', async () => {
            const mockUpdatedDispute = { id: '1', status: 'resolved', adminRemarks: 'Fixed' };
            sinon.stub(DisputesModel, 'findByIdAndUpdate').resolves(mockUpdatedDispute);

            const result = await DisputesRepository.updateById('1', 'resolved', 'Fixed', 'admin123');
            expect(result).to.deep.equal(mockUpdatedDispute);
        });
    });

    describe('saveDispute', () => {
        it('should save dispute successfully', async () => {
            const mockDispute = { id: '1', status: 'pending' };
            sinon.stub(mockDispute, 'save').resolves(mockDispute);

            const result = await DisputesRepository.saveDispute(mockDispute);
            expect(result).to.deep.equal(mockDispute);
        });
    });
});
