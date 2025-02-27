const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const TransactionRepository = require('../repositories/transactionRepository');
const TransactionModel = require('../models/tranasactionModel');
const UserModel = require('../models/userModel');

describe('TransactionRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset mocks after each test
    });

    describe('createTransaction', () => {
        it('should create a transaction successfully', async () => {
            const mockTransaction = { transactionId: 'TX12345', amount: 100, status: 'pending' };
            sinon.stub(TransactionModel, 'create').resolves(mockTransaction);

            const result = await TransactionRepository.createTransaction(mockTransaction);
            expect(result).to.deep.equal(mockTransaction);
        });
    });

    describe('findUserByAccNo', () => {
        it('should return user details when account number is found', async () => {
            const mockUser = { accNo: '1234567890', email: 'user@test.com' };
            sinon.stub(UserModel, 'findOne').resolves(mockUser);

            const result = await TransactionRepository.findUserByAccNo('1234567890');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user not found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await TransactionRepository.findUserByAccNo('0000000000');
            expect(result).to.be.null;
        });
    });

    describe('findTransactionById', () => {
        it('should return transaction when found', async () => {
            const mockTransaction = { transactionId: 'TX12345', amount: 100 };
            sinon.stub(TransactionModel, 'findOne').resolves(mockTransaction);

            const result = await TransactionRepository.findTransactionById('TX12345');
            expect(result).to.deep.equal(mockTransaction);
        });

        it('should return null if transaction not found', async () => {
            sinon.stub(TransactionModel, 'findOne').resolves(null);

            const result = await TransactionRepository.findTransactionById('INVALID123');
            expect(result).to.be.null;
        });
    });

    describe('findFailedTransactionById', () => {
        it('should return failed transaction when found', async () => {
            const mockTransaction = { transactionId: 'TX12345', status: 'failed' };
            sinon.stub(TransactionModel, 'findOne').resolves(mockTransaction);

            const result = await TransactionRepository.findFailedTransactionById('TX12345');
            expect(result).to.deep.equal(mockTransaction);
        });

        it('should return null if failed transaction is not found', async () => {
            sinon.stub(TransactionModel, 'findOne').resolves(null);

            const result = await TransactionRepository.findFailedTransactionById('VALID123');
            expect(result).to.be.null;
        });
    });

    describe('updateTransactionStatus', () => {
        it('should update the transaction status successfully', async () => {
            const mockTransaction = { transactionId: 'TX12345', status: 'completed' };
            sinon.stub(TransactionModel, 'findOneAndUpdate').resolves(mockTransaction);

            const result = await TransactionRepository.updateTransactionStatus('TX12345', 'completed');
            expect(result).to.deep.equal(mockTransaction);
        });

        it('should return null if transaction not found for update', async () => {
            sinon.stub(TransactionModel, 'findOneAndUpdate').resolves(null);

            const result = await TransactionRepository.updateTransactionStatus('INVALID123', 'completed');
            expect(result).to.be.null;
        });
    });

    describe('getUserByEmail', () => {
        it('should return user details when email is found', async () => {
            const mockUser = { email: 'user@test.com', accNo: '1234567890' };
            sinon.stub(UserModel, 'findOne').resolves(mockUser);

            const result = await TransactionRepository.getUserByEmail('user@test.com');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user not found by email', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await TransactionRepository.getUserByEmail('unknown@test.com');
            expect(result).to.be.null;
        });
    });

    describe('updateUserTransactions', () => {
        it('should update user transactions successfully', async () => {
            const mockUser = { email: 'user@test.com', transactions: [{ transactionId: 'TX12345', amount: 100 }] };
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(mockUser);

            const result = await TransactionRepository.updateUserTransactions('user@test.com', mockUser.transactions);
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user not found for transactions update', async () => {
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(null);

            const result = await TransactionRepository.updateUserTransactions('unknown@test.com', []);
            expect(result).to.be.null;
        });
    });

    describe('deleteUserTransactions', () => {
        it('should delete user transactions successfully', async () => {
            const mockUser = { email: 'user@test.com', transactions: [] };
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(mockUser);

            const result = await TransactionRepository.deleteUserTransactions('user@test.com');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user not found for transaction deletion', async () => {
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(null);

            const result = await TransactionRepository.deleteUserTransactions('unknown@test.com');
            expect(result).to.be.null;
        });
    });
});
