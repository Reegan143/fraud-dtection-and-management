const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const UserProfileRepository = require('../repositories/userProfileRepository');
const UserModel = require('../models/userModel');

describe('UserProfileRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset mocks after each test
    });

    describe('getUserByEmail', () => {
        it('should return user details excluding password when email is found', async () => {
            const mockUser = { email: 'test@test.com', name: 'John Doe' };
            sinon.stub(UserModel, 'findOne').resolves(mockUser);

            const result = await UserProfileRepository.getUserByEmail('test@test.com');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user is not found by email', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await UserProfileRepository.getUserByEmail('unknown@test.com');
            expect(result).to.be.null;
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            const mockUpdatedUser = { email: 'test@test.com', name: 'Updated Name' };
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(mockUpdatedUser);

            const result = await UserProfileRepository.updateUserProfile('test@test.com', { name: 'Updated Name' });
            expect(result).to.deep.equal(mockUpdatedUser);
        });

        it('should return null if user not found for profile update', async () => {
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(null);

            const result = await UserProfileRepository.updateUserProfile('unknown@test.com', { name: 'New Name' });
            expect(result).to.be.null;
        });
    });

    describe('updateUserPassword', () => {
        it('should update user password successfully', async () => {
            const mockUpdatedUser = { email: 'test@test.com', password: 'hashedpassword' };
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(mockUpdatedUser);

            const result = await UserProfileRepository.updateUserPassword('test@test.com', 'hashedpassword');
            expect(result).to.deep.equal(mockUpdatedUser);
        });

        it('should return null if user not found for password update', async () => {
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(null);

            const result = await UserProfileRepository.updateUserPassword('unknown@test.com', 'newhashedpassword');
            expect(result).to.be.null;
        });
    });
});
