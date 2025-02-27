const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const NotificationService = require('../services/notificationservices');
const NotificationRepository = require('../repositories/notificationRepository');

describe('NotificationService Tests', () => {
    beforeEach(() => {
        // ✅ Stub only specific repository methods
        sinon.stub(NotificationRepository, 'createNotification');
        sinon.stub(NotificationRepository, 'getUserNotifications');
        sinon.stub(NotificationRepository, 'markNotificationAsRead');
    });

    afterEach(() => {
        sinon.restore(); // ✅ Restore original methods
    });

    describe('createNotification', () => {
        it('should successfully create a notification', async () => {
            const notificationData = { email: 'test@example.com', message: 'Test Notification' };
            NotificationRepository.createNotification.resolves(notificationData);

            const result = await NotificationService.createNotification(notificationData);

            expect(result).to.deep.equal(notificationData);
            expect(NotificationRepository.createNotification.calledOnceWith(notificationData)).to.be.true;
        });

        it('should throw an error when creation fails', async () => {
            NotificationRepository.createNotification.rejects(new Error('Database Error'));

            try {
                await NotificationService.createNotification({});
                throw new Error('Test should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Database Error');
            }
        });
    });

    describe('getUserNotifications', () => {
        it('should return user notifications if they exist', async () => {
            const mockNotifications = [
                { email: 'test@example.com', message: 'Notification 1' },
                { email: 'test@example.com', message: 'Notification 2' }
            ];
            NotificationRepository.getUserNotifications.resolves(mockNotifications);

            const result = await NotificationService.getUserNotifications('test@example.com');

            expect(result).to.deep.equal(mockNotifications);
            expect(NotificationRepository.getUserNotifications.calledOnceWith('test@example.com')).to.be.true;
        });

        it('should return an empty array when no notifications exist (null case)', async () => {
            NotificationRepository.getUserNotifications.resolves(null);

            const result = await NotificationService.getUserNotifications('test@example.com');

            expect(result).to.deep.equal([]); // ✅ Should return an empty array
        });

        it('should return an empty array when notifications are undefined', async () => {
            NotificationRepository.getUserNotifications.resolves(undefined);

            const result = await NotificationService.getUserNotifications('test@example.com');

            expect(result).to.deep.equal([]);
        });

        it('should handle database errors', async () => {
            NotificationRepository.getUserNotifications.rejects(new Error('Database Error'));

            try {
                await NotificationService.getUserNotifications('test@example.com');
                throw new Error('Test should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Database Error');
            }
        });
    });

    describe('markAsRead', () => {
        it('should mark a notification as read successfully', async () => {
            const mockNotification = { id: '1', email: 'test@example.com', isRead: true };
            NotificationRepository.markNotificationAsRead.resolves(mockNotification);

            const result = await NotificationService.markAsRead('1');

            expect(result).to.deep.equal(mockNotification);
            expect(NotificationRepository.markNotificationAsRead.calledOnceWith('1')).to.be.true;
        });

        it('should throw an error if notification is null', async () => {
            NotificationRepository.markNotificationAsRead.resolves(null);

            try {
                await NotificationService.markAsRead('1');
                throw new Error('Test should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Notification not found');
            }
        });

        it('should throw an error if notification is undefined', async () => {
            NotificationRepository.markNotificationAsRead.resolves(undefined);

            try {
                await NotificationService.markAsRead('1');
                throw new Error('Test should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Notification not found');
            }
        });

        it('should handle database update errors correctly', async () => {
            NotificationRepository.markNotificationAsRead.rejects(new Error('Database Error'));

            try {
                await NotificationService.markAsRead('1');
                throw new Error('Test should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('Database Error');
            }
        });
    });
});
