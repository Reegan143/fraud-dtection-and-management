const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const UserProfileController = require('../controllers/userProfileController');
const UserProfileService = require('../services/userProfileServices');

describe('UserProfileController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { email: 'user@test.com' }, // Mock authenticated user
            body: {} // Mock request body
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getUserProfile', () => {
        it('should return user profile successfully', async () => {
            sinon.stub(UserProfileService, 'getUserProfile').resolves({ email: 'user@test.com', name: 'Test User' });

            await UserProfileController.getUserProfile(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ email: 'user@test.com', name: 'Test User' })).to.be.true;
        });

        it('should handle errors when fetching user profile', async () => {
            sinon.stub(UserProfileService, 'getUserProfile').rejects(new Error('Error fetching user profile'));

            await UserProfileController.getUserProfile(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Error fetching user profile' })).to.be.true;
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            req.body = { name: 'Updated User' };
            sinon.stub(UserProfileService, 'updateUserProfile').resolves({ email: 'user@test.com', name: 'Updated User' });

            await UserProfileController.updateUserProfile(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Profile updated successfully' })).to.be.true;
        });

        it('should handle errors when updating user profile', async () => {
            sinon.stub(UserProfileService, 'updateUserProfile').rejects(new Error('Error updating user profile'));

            await UserProfileController.updateUserProfile(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Error updating user profile' })).to.be.true;
        });
    });
});
