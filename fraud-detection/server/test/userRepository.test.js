const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const UserRepository = require('../repositories/userRepository');
const UserModel = require('../models/userModel');

describe('UserRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset mocks after each test
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const mockUser = { email: 'test@test.com', name: 'John Doe' };
            sinon.stub(UserModel, 'create').resolves(mockUser);

            const result = await UserRepository.createUser(mockUser);
            expect(result).to.deep.equal(mockUser);
        });
    });

    describe('findVendor', () => {
        it('should find a vendor by name', async () => {
            const mockVendor = { vendorName: 'Test Vendor' };
            sinon.stub(UserModel, 'findOne').resolves(mockVendor);

            const result = await UserRepository.findVendor('Test Vendor');
            expect(result).to.deep.equal(mockVendor);
        });

        it('should return null if vendor is not found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await UserRepository.findVendor('Unknown Vendor');
            expect(result).to.be.null;
        });
    });

    describe('findUserByEmail', () => {
        it('should find a user by email', async () => {
            const mockUser = { email: 'test@test.com', name: 'John Doe' };
            sinon.stub(UserModel, 'findOne').resolves(mockUser);

            const result = await UserRepository.findUserByEmail('test@test.com');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user is not found by email', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await UserRepository.findUserByEmail('unknown@test.com');
            expect(result).to.be.null;
        });
    });

    describe('findUserById', () => {
        it('should find a user by ID', async () => {
            const mockUser = { _id: '12345', email: 'test@test.com' };
            sinon.stub(UserModel, 'findById').resolves(mockUser);

            const result = await UserRepository.findUserById('12345');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user is not found by ID', async () => {
            sinon.stub(UserModel, 'findById').resolves(null);

            const result = await UserRepository.findUserById('99999');
            expect(result).to.be.null;
        });
    });

    describe('updateUserById', () => {
        it('should update a user successfully', async () => {
            const mockUpdatedUser = { _id: '12345', email: 'test@test.com', name: 'Updated Name' };
            sinon.stub(UserModel, 'findByIdAndUpdate').resolves(mockUpdatedUser);

            const result = await UserRepository.updateUserById('12345', { name: 'Updated Name' });
            expect(result).to.deep.equal(mockUpdatedUser);
        });

        it('should return null if user is not found for update', async () => {
            sinon.stub(UserModel, 'findByIdAndUpdate').resolves(null);

            const result = await UserRepository.updateUserById('99999', { name: 'New Name' });
            expect(result).to.be.null;
        });
    });

    describe('deleteUserById', () => {
        it('should delete a user successfully', async () => {
            const mockDeletedUser = { _id: '12345', email: 'test@test.com' };
            sinon.stub(UserModel, 'findByIdAndDelete').resolves(mockDeletedUser);

            const result = await UserRepository.deleteUserById('12345');
            expect(result).to.deep.equal(mockDeletedUser);
        });

        it('should return null if user is not found for deletion', async () => {
            sinon.stub(UserModel, 'findByIdAndDelete').resolves(null);

            const result = await UserRepository.deleteUserById('99999');
            expect(result).to.be.null;
        });
    });

    describe('storeOTP', () => {
        it('should store OTP for a user', async () => {
            const mockUser = { email: 'test@test.com', otp: 1234 };
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(mockUser);

            const result = await UserRepository.storeOTP('test@test.com', 1234);
            expect(result).to.deep.equal(mockUser);
        });
    });

    describe('verifyOTP', () => {
        it('should verify OTP successfully', async () => {
            const mockUser = { email: 'test@test.com', otp: 1234 };
            sinon.stub(UserModel, 'findOne').resolves(mockUser);

            const result = await UserRepository.verifyOTP('test@test.com', 1234);
            expect(result).to.be.true;
        });

        it('should return false if OTP is incorrect', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await UserRepository.verifyOTP('test@test.com', 9999);
            expect(result).to.be.false;
        });
    });

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            const mockUsers = [{ email: 'user1@test.com' }, { email: 'user2@test.com' }];
            sinon.stub(UserModel, 'find').resolves(mockUsers);

            const result = await UserRepository.getAllUsers();
            expect(result).to.deep.equal(mockUsers);
        });

        it('should return an empty array if no users exist', async () => {
            sinon.stub(UserModel, 'find').resolves([]);

            const result = await UserRepository.getAllUsers();
            expect(result).to.deep.equal([]);
        });
    });

    describe('findOneAndUpdate', () => {
        it('should update API key successfully', async () => {
            const mockUser = { email: 'test@test.com', apiKey: 'new-api-key' };
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(mockUser);

            const result = await UserRepository.findOneAndUpdate('test@test.com', 'new-api-key');
            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user not found for API key update', async () => {
            sinon.stub(UserModel, 'findOneAndUpdate').resolves(null);

            const result = await UserRepository.findOneAndUpdate('unknown@test.com', 'new-api-key');
            expect(result).to.be.null;
        });
    });
});
