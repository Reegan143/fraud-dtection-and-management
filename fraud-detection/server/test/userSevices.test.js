const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserService = require('../services/userServices');
const UserRepository = require('../repositories/userRepository');

describe('UserService Tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves(null);
            sinon.stub(UserRepository, 'createUser').resolves({ email: 'test@example.com' });
            sinon.stub(bcrypt, 'hash').resolves('hashedpassword');

            const userData = { email: 'test@example.com', password: 'password123' };
            const result = await UserService.registerUser(userData);

            expect(result).to.have.property('email', 'test@example.com');
        });

        it('should throw an error if the user already exists', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves({ email: 'test@example.com' });

            try {
                await UserService.registerUser({ email: 'test@example.com', password: 'password123' });
            } catch (error) {
                expect(error.message).to.equal('User already exists');
            }
        });
    });

    describe('loginUser', () => {
        it('should login a user successfully and return a token', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashedpassword', _id: '123' };
            sinon.stub(UserRepository, 'findUserByEmail').resolves(mockUser);
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').returns('mockedToken');

            const result = await UserService.loginUser('test@example.com', 'password123');

            expect(result).to.have.property('token', 'mockedToken');
        });

        it('should throw an error for invalid credentials', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves(null);

            try {
                await UserService.loginUser('test@example.com', 'password123');
            } catch (error) {
                expect(error.message).to.equal('Invalid Credentials');
            }
        });

        it('should throw an error for incorrect password', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves({ email: 'test@example.com', password: 'hashedpassword' });
            sinon.stub(bcrypt, 'compare').resolves(false);

            try {
                await UserService.loginUser('test@example.com', 'wrongpassword');
            } catch (error) {
                expect(error.message).to.equal('Invalid CREDENTIALS');
            }
        });
    });

    describe('sendOTP', () => {
        it('should send OTP to the user successfully', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves({ email: 'test@example.com' });
            sinon.stub(nodemailer, 'createTransport').returns({
                sendMail: sinon.stub().resolves(),
            });

            const result = await UserService.sendOTP('test@example.com');

            expect(result.message).to.equal('OTP sent successfully');
        });

        it('should throw an error if user is not found', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves(null);

            try {
                await UserService.sendOTP('invalid@example.com');
            } catch (error) {
                expect(error.message).to.equal('User not found');
            }
        });
    });

    describe('verifyOTP', () => {
        it('should verify OTP and reset password', async () => {
            UserService.otpStore['test@example.com'] = 1234;
            sinon.stub(UserService, 'resetPassword').resolves();

            const result = await UserService.verifyOTP('test@example.com', 1234, 'newPassword');

            expect(result.message).to.equal('Password reset successful');
        });

        it('should throw an error for invalid OTP', async () => {
            UserService.otpStore['test@example.com'] = 5678;

            try {
                await UserService.verifyOTP('test@example.com', 1234, 'newPassword');
            } catch (error) {
                expect(error.message).to.equal('Invalid OTP');
            }
        });
    });

    describe('resetPassword', () => {
        it('should reset password successfully', async () => {
            const mockUser = { email: 'test@example.com', save: sinon.stub().resolves() };
            sinon.stub(UserRepository, 'findUserByEmail').resolves(mockUser);
            sinon.stub(bcrypt, 'hash').resolves('newHashedPassword');

            const result = await UserService.resetPassword('test@example.com', 'newPassword');

            expect(mockUser.password).to.equal('newHashedPassword');
        });

        it('should throw an error if user is not found', async () => {
            sinon.stub(UserRepository, 'findUserByEmail').resolves(null);

            try {
                await UserService.resetPassword('invalid@example.com', 'newPassword');
            } catch (error) {
                expect(error.message).to.equal('User not found');
            }
        });
    });

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            sinon.stub(UserRepository, 'getAllUsers').resolves([{ email: 'test@example.com' }]);

            const result = await UserService.getAllUsers();

            expect(result).to.be.an('array').that.has.lengthOf(1);
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const mockUser = { email: 'test@example.com' };
            sinon.stub(UserRepository, 'findUserById').resolves(mockUser);

            const result = await UserService.getUserById('123');

            expect(result).to.deep.equal(mockUser);
        });
    });

    describe('updateUser', () => {
        it('should update user details successfully', async () => {
            const updatedUser = { email: 'test@example.com', name: 'Updated Name' };
            sinon.stub(UserRepository, 'updateUserById').resolves(updatedUser);

            const result = await UserService.updateUser('123', { name: 'Updated Name' });

            expect(result).to.deep.equal(updatedUser);
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            sinon.stub(UserRepository, 'deleteUserById').resolves(true);

            const result = await UserService.deleteUser('123');

            expect(result).to.be.true;
        });
    });
});
