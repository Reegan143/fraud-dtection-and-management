const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const UserProfileService = require('../services/userProfileServices');
const UserProfileRepository = require('../repositories/userProfileRepository');

describe('UserProfileService Tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getUserProfile', () => {
        it('should return user profile if email is valid', async () => {
            const mockUser = { email: 'test@example.com', name: 'John Doe' };
            sinon.stub(UserProfileRepository, 'getUserByEmail').resolves(mockUser);

            const result = await UserProfileService.getUserProfile('test@example.com');

            expect(result).to.deep.equal(mockUser);
        });

        it('should throw an error if user is not found', async () => {
            sinon.stub(UserProfileRepository, 'getUserByEmail').resolves(null);

            try {
                await UserProfileService.getUserProfile('invalid@example.com');
            } catch (error) {
                expect(error.message).to.equal('User not found');
            }
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            const mockUser = { email: 'test@example.com', name: 'John Doe', age: 25 };
            const updatedData = { age: 30 };

            sinon.stub(UserProfileRepository, 'updateUserProfile').resolves({ ...mockUser, ...updatedData });

            const result = await UserProfileService.updateUserProfile('test@example.com', updatedData);

            expect(result.age).to.equal(30);
        });

        it('should throw an error if profile update fails', async () => {
            sinon.stub(UserProfileRepository, 'updateUserProfile').resolves(null);

            try {
                await UserProfileService.updateUserProfile('test@example.com', { age: 30 });
            } catch (error) {
                expect(error.message).to.equal('Failed to update profile');
            }
        });
    });
});
