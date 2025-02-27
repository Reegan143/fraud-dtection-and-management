const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const TransactionController = require('../controllers/transactionController');
const TransactionService = require('../services/transactionServices');

describe('TransactionController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: { email: 'user@test.com' }, // Mock authenticated user
            params: { transactionId: 'trans123' } // Mock transaction ID
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('makeTransaction', () => {
        it('should create a transaction successfully', async () => {
            sinon.stub(TransactionService, 'makeTransaction').resolves({ transactionId: 'trans123', status: 'success' });

            await TransactionController.makeTransaction(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWithMatch({ transactionId: 'trans123', status: 'success' })).to.be.true;
        });

        it('should handle errors when creating a transaction', async () => {
            sinon.stub(TransactionService, 'makeTransaction').rejects(new Error('Transaction failed'));

            await TransactionController.makeTransaction(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Transaction failed" })).to.be.true;
        });
    });

    describe('checkAndHandleFailedTransaction', () => {
        it('should check and handle a failed transaction successfully', async () => {
            req.body = { transactionId: 'trans123', userEmail: 'user@test.com', amount: 100, ticketNumber: 'T123' };
            sinon.stub(TransactionService, 'checkAndHandleFailedTransaction').resolves(true);

            await TransactionController.checkAndHandleFailedTransaction(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ success: true })).to.be.true;
        });

        it('should handle errors when checking failed transactions', async () => {
            sinon.stub(TransactionService, 'checkAndHandleFailedTransaction').rejects(new Error('Transaction check failed'));

            await TransactionController.checkAndHandleFailedTransaction(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Failed to handle transaction" })).to.be.true;
        });
    });

    describe('getUserTransactions', () => {
        it('should return user transactions successfully', async () => {
            sinon.stub(TransactionService, 'getUserTransactions').resolves([
                { transactionId: 'trans123', amount: 500, status: 'success' }
            ]);

            await TransactionController.getUserTransactions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch([{ transactionId: 'trans123', amount: 500, status: 'success' }])).to.be.true;
        });

        it('should handle error if transactions not found', async () => {
            sinon.stub(TransactionService, 'getUserTransactions').rejects(new Error('Failed to retrieve transactions'));

            await TransactionController.getUserTransactions(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Failed to retrieve transactions" })).to.be.true;
        });
    });

    describe('deleteTransactions', () => {
        it('should delete user transactions successfully', async () => {
            sinon.stub(TransactionService, 'deleteTransactions').resolves();

            await TransactionController.deleteTransactions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Transactions deleted successfully" })).to.be.true;
        });

        it('should handle errors when deleting transactions', async () => {
            sinon.stub(TransactionService, 'deleteTransactions').rejects(new Error('Deletion failed'));

            await TransactionController.deleteTransactions(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Failed to delete transactions" })).to.be.true;
        });
    });
});
