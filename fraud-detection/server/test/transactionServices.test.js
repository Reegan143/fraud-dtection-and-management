const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const TransactionService = require('../services/transactionServices');
const TransactionRepository = require('../repositories/transactionRepository');
const { sendMail } = require('../utils/email_checker');

describe('TransactionService Tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('makeTransaction', () => {
        it('should successfully make a transaction', async () => {
            const sender = { userName: 'John Doe', debitCardNumber: '1234567890123456', transactions: [], save: sinon.stub().resolves() };
            const receiver = { userName: 'Jane Doe', transactions: [], save: sinon.stub().resolves() };

            sinon.stub(TransactionRepository, 'findUserByAccNo')
                .withArgs('ACC123').resolves(sender)
                .withArgs('ACC456').resolves(receiver);
            sinon.stub(TransactionRepository, 'createTransaction').resolves();

            const transactionData = {
                senderAccNo: 'ACC123',
                receiverAccNo: 'ACC456',
                amount: 100,
                debitCardNumber: '1234567890123456',
                transactionId: 'TX123',
                status: 'paid'
            };

            const result = await TransactionService.makeTransaction(transactionData);

            expect(result.message).to.equal('Transaction initiated successfully!');
        });

        it('should return error if sender account is not found', async () => {
            sinon.stub(TransactionRepository, 'findUserByAccNo').resolves(null);

            try {
                await TransactionService.makeTransaction({
                    senderAccNo: 'ACC123',
                    receiverAccNo: 'ACC456',
                    amount: 100,
                    debitCardNumber: '1234567890123456',
                    transactionId: 'TX123',
                    status: 'paid'
                });
            } catch (error) {
                expect(error.message).to.equal('Sender account not found');
            }
        });
    });

    // describe('checkAndHandleFailedTransaction', () => {
    //     it('should send email if transaction is failed', async () => {
    //         sinon.stub(TransactionRepository, 'findFailedTransactionById').resolves({ transactionId: 'TX123', status: 'failed' });
    //         sinon.stub(TransactionRepository, 'getUserByEmail').resolves({ email: 'user@test.com', transactions: [{ transactionId: 'TX123', status: 'failed' }] });
    //         sinon.stub(sendMail).resolves();

    //         const result = await TransactionService.checkAndHandleFailedTransaction('TX123', 'user@test.com', 100, 'TICKET123');

    //         expect(result).to.be.true;
    //     });

    //     it('should return false if transaction is not found', async () => {
    //         sinon.stub(TransactionRepository, 'findFailedTransactionById').resolves(null);

    //         const result = await TransactionService.checkAndHandleFailedTransaction('TX123', 'user@test.com', 100, 'TICKET123');

    //         expect(result).to.be.false;
    //     });
    // });

    describe('getUserTransactions', () => {
        it('should return user transactions', async () => {
            sinon.stub(TransactionRepository, 'getUserByEmail').resolves({ transactions: [{ transactionId: 'TX123' }] });

            const result = await TransactionService.getUserTransactions('user@test.com');

            expect(result).to.have.lengthOf(1);
        });

        it('should return error if user is not found', async () => {
            sinon.stub(TransactionRepository, 'getUserByEmail').resolves(null);

            try {
                await TransactionService.getUserTransactions('user@test.com');
            } catch (error) {
                expect(error.message).to.equal('User not found');
            }
        });
    });

    describe('deleteTransactions', () => {
        it('should delete user transactions', async () => {
            sinon.stub(TransactionRepository, 'deleteUserTransactions').resolves(true);

            const result = await TransactionService.deleteTransactions('user@test.com');

            expect(result).to.be.true;
        });
    });
});
