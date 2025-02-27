const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const NotificationRepository = require('../repositories/notificationRepository');
const NotificationModel = require('../models/noticationModel');

describe('NotificationRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset mocks after each test
    });

    describe('createNotification', () => {
        it('should create a notification successfully', async () => {
            const mockNotification = { email: 'user@test.com', message: 'New transaction alert' };
            sinon.stub(NotificationModel, 'create').resolves(mockNotification);

            const result = await NotificationRepository.createNotification(mockNotification);
            expect(result).to.deep.equal(mockNotification);
        });
    });

    describe('NotificationRepository Tests', () => {
        afterEach(() => {
            sinon.restore(); // Restore stubs after each test
        });
    
        describe('getUserNotifications', () => {
            it('should return notifications for a given user sorted by createdAt', async () => {
                const mockNotifications = [
                    { email: 'user@test.com', message: 'Notification 1', createdAt: new Date('2024-02-20') },
                    { email: 'user@test.com', message: 'Notification 2', createdAt: new Date('2024-02-21') }
                ];
    
                const findStub = sinon.stub(NotificationModel, 'find').returns({
                    sort: sinon.stub().returns(mockNotifications)
                });
    
                const result = await NotificationRepository.getUserNotifications('user@test.com');
    
                expect(result).to.deep.equal(mockNotifications);
                expect(findStub.calledOnceWith({ email: 'user@test.com' })).to.be.true;
            });
    
            it('should return an empty array if no notifications are found', async () => {
                const findStub = sinon.stub(NotificationModel, 'find').returns({
                    sort: sinon.stub().returns([])
                });
    
                const result = await NotificationRepository.getUserNotifications('user@test.com');
    
                expect(result).to.deep.equal([]);
                expect(findStub.calledOnceWith({ email: 'user@test.com' })).to.be.true;
            });
    
            it('should handle database errors properly', async () => {
                sinon.stub(NotificationModel, 'find').throws(new Error('Database Error'));
    
                try {
                    await NotificationRepository.getUserNotifications('user@test.com');
                } catch (error) {
                    expect(error.message).to.equal('Database Error');
                }
            });
        });
    });



    describe('markNotificationAsRead', () => {
        it('should mark a notification as read successfully', async () => {
            const mockNotification = { id: '1', message: 'New transaction alert', isRead: true };
            sinon.stub(NotificationModel, 'findByIdAndUpdate').resolves(mockNotification);

            const result = await NotificationRepository.markNotificationAsRead('1');
            expect(result).to.deep.equal(mockNotification);
        });

        it('should return null if notification is not found', async () => {
            sinon.stub(NotificationModel, 'findByIdAndUpdate').resolves(null);

            const result = await NotificationRepository.markNotificationAsRead('999');
            expect(result).to.be.null;
        });
    });
});
