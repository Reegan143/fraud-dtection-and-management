const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const DisputesService = require('../services/disputeServices');
const DisputesRepository = require('../repositories/disputesRepository');
const NotificationRepository = require('../repositories/notificationRepository');
const UserRepository = require('../repositories/userRepository');
const { sendMail } = require('../utils/sendMail');

describe('DisputesService Tests', () => {
    let repositoryStub, notificationStub, userStub, mailStub;

    beforeEach(() => {
        repositoryStub = sinon.stub(DisputesRepository);
        notificationStub = sinon.stub(NotificationRepository);
        userStub = sinon.stub(UserRepository);
        mailStub = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('registerDispute', () => {
        it('should register a dispute successfully', async () => {
            const user = { userId: '123', email: 'test@example.com' };
            const disputeData = {
                transactionId: '9876543210',
                complaintType: 'Unauthorized Transaction',
                vendorName: 'VendorXYZ',
                description: 'Payment issue',
                debitCardNumber: '1234567812345678'
            };

            const adminMock = { adminId: 'admin123', email: 'admin@example.com' };
            const transactionMock = { amount: 100, status: 'completed' };
            const userRecordMock = { cardType: 'Credit' };
            const vendorMock = { email: 'vendor@example.com' };
            const ticketNumberMock = '100001';

            repositoryStub.findAdmin.resolves(adminMock);
            repositoryStub.findDisputeByTransactionId.resolves(null);
            repositoryStub.findTransactionById.resolves(transactionMock);
            repositoryStub.findUserByDebitCard.resolves(userRecordMock);
            repositoryStub.generateUniqueTicketNumber.resolves(ticketNumberMock);
            repositoryStub.createDispute.resolves({ ticketNumber: ticketNumberMock });

            userStub.findUserById.resolves({ userName: 'John Doe' });
            userStub.findVendor.resolves(vendorMock);

            mailStub.resolves();

            const result = await DisputesService.registerDispute(user, disputeData);

            expect(result).to.have.property('ticketNumber', ticketNumberMock);
            expect(repositoryStub.createDispute.calledOnce).to.be.true;
            expect(notificationStub.createNotification.calledThrice).to.be.true;
        });

        it('should throw an error if admin is not found', async () => {
            repositoryStub.findAdmin.resolves(null);

            try {
                await DisputesService.registerDispute({}, {});
            } catch (error) {
                expect(error.message).to.equal('Admin not found');
            }
        });

        it('should throw an error if transaction is not found', async () => {
            repositoryStub.findAdmin.resolves({ adminId: 'admin123' });
            repositoryStub.findTransactionById.resolves(null);

            try {
                await DisputesService.registerDispute({}, { transactionId: '9876543210' });
            } catch (error) {
                expect(error.message).to.equal('No transaction found');
            }
        });

        it('should throw an error if debit card number is not found', async () => {
            repositoryStub.findAdmin.resolves({ adminId: 'admin123' });
            repositoryStub.findTransactionById.resolves({ amount: 100 });
            repositoryStub.findUserByDebitCard.resolves(null);

            try {
                await DisputesService.registerDispute({}, { debitCardNumber: '1234' });
            } catch (error) {
                expect(error.message).to.equal('Debit Card Number Not Found');
            }
        });

        it('should throw an error if vendor is not found', async () => {
            repositoryStub.findAdmin.resolves({ adminId: 'admin123' });
            repositoryStub.findTransactionById.resolves({ amount: 100 });
            repositoryStub.findUserByDebitCard.resolves({ cardType: 'Credit' });
            userStub.findVendor.resolves(null);
        });
    });

    describe('handlefailedTransaction', () => {
        it('should handle failed transactions and notify user', async () => {
            const disputeMock = {
                ticketNumber: '100001',
                email: 'test@example.com',
                amount: 200,
                vendorName: 'VendorXYZ',
                status: 'failed'
            };

            repositoryStub.getDisputeByTicketNumber.resolves(disputeMock);
            repositoryStub.saveDispute.resolves(disputeMock);
            notificationStub.createNotification.resolves();
            mailStub.resolves();

            await DisputesService.handlefailedTransaction('test@example.com', '100001', 'John Doe', 200, 'Refund Processed', 'approved');

            expect(repositoryStub.saveDispute.calledOnce).to.be.false;
            expect(notificationStub.createNotification.calledOnce).to.be.false;
            expect(mailStub.calledOnce).to.be.false;
        });
    });

    describe('getAllDisputes', () => {
        it('should return all disputes', async () => {
            const disputesMock = [{ id: '1', complaintType: 'Unauthorized' }];
            repositoryStub.getAllDisputes.resolves(disputesMock);

            const result = await DisputesService.getAllDisputes();

            expect(result).to.deep.equal(disputesMock);
        });
    });

    describe('getUserDisputes', () => {
        it('should return user disputes', async () => {
            const disputesMock = [{ id: '1', email: 'test@example.com' }];
            repositoryStub.getUserDisputes.resolves(disputesMock);

            const result = await DisputesService.getUserDisputes('test@example.com');

            expect(result).to.deep.equal(disputesMock);
        });
    });

    describe('getDisputeById', () => {
        it('should return a dispute by ID', async () => {
            const disputeMock = { id: '1', complaintType: 'Double Charge' };
            repositoryStub.getDisputeById.resolves(disputeMock);

            const result = await DisputesService.getDisputeById('1');

            expect(result).to.deep.equal(disputeMock);
        });
    });

    describe('getDisputeByVendorName', () => {
        it('should return disputes by vendor name', async () => {
            const disputesMock = [{ id: '1', vendorName: 'VendorXYZ' }];
            repositoryStub.getDisputeByVendorName.resolves(disputesMock);

            const result = await DisputesService.getDisputeByVendorName('VendorXYZ');

            expect(result).to.deep.equal(disputesMock);
        });
    });

    describe('getDisputeByTicketNumber', () => {
        it('should return a dispute by ticket number', async () => {
            const disputeMock = { ticketNumber: '100001', complaintType: 'Refund Request' };
            repositoryStub.getDisputeByTicketNumber.resolves(disputeMock);

            const result = await DisputesService.getDisputeByTicketNumber('100001');

            expect(result).to.deep.equal(disputeMock);
        });
    });
});
