const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const NotificationController = require('../controllers/notificationController');
const NotificationService = require('../services/notificationservices');

describe('NotificationController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { email: 'user@test.com' }, // Mock authenticated user
            params: { id: 'notif123' } // Mock notification ID
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getNotifications', () => {
        it('should return user notifications successfully', async () => {
            sinon.stub(NotificationService, 'getUserNotifications').resolves([
                { id: 'notif123', message: 'New transaction alert' }
            ]);

            await NotificationController.getNotifications(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch([{ id: 'notif123', message: 'New transaction alert' }])).to.be.true;
        });

        it('should return 404 if no notifications exist', async () => {
            sinon.stub(NotificationService, 'getUserNotifications').resolves([]);

            await NotificationController.getNotifications(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ message: "No notifications found" })).to.be.true;
        });

        it('should handle errors while fetching notifications', async () => {
            sinon.stub(NotificationService, 'getUserNotifications').rejects(new Error('Database error'));

            await NotificationController.getNotifications(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Failed to fetch notifications" })).to.be.true;
        });
    });

    describe('markAsRead', () => {
        it('should mark a notification as read successfully', async () => {
            sinon.stub(NotificationService, 'markAsRead').resolves({ id: 'notif123', status: 'read' });

            await NotificationController.markAsRead(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Notification marked as read", notification: { id: 'notif123', status: 'read' } })).to.be.true;
        });

        it('should handle errors when marking a notification as read', async () => {
            sinon.stub(NotificationService, 'markAsRead').rejects(new Error('Update failed'));

            await NotificationController.markAsRead(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Failed to update notification" })).to.be.true;
        });
    });
});
