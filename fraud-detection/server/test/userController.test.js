const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const UserController = require('../controllers/userController');
const UserService = require('../services/userServices');

describe('UserController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { userId: '12345', email: 'user@test.com' } // Mock authenticated user
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('registerUser', () => {
        it('should register a user successfully', async () => {
            sinon.stub(UserService, 'registerUser').resolves({ id: '1', email: 'test@user.com' });

            await UserController.registerUser(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWithMatch({ message: "User registered successfully" })).to.be.true;
        });

        it('should handle errors when registering user', async () => {
            sinon.stub(UserService, 'registerUser').rejects(new Error('Registration failed'));

            await UserController.registerUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Registration failed' })).to.be.true;
        });
    });

    describe('loginUser', () => {
        it('should log in a user successfully', async () => {
            req.body = { email: 'test@user.com', password: 'password123' };
            sinon.stub(UserService, 'loginUser').resolves({ token: 'abcd1234' });

            await UserController.loginUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ token: 'abcd1234' })).to.be.true;
        });

        it('should return 401 if login fails', async () => {
            sinon.stub(UserService, 'loginUser').rejects(new Error('Invalid credentials'));

            await UserController.loginUser(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Invalid credentials' })).to.be.true;
        });
    });

    describe('getAllUsers', () => {
        it('should return all users successfully', async () => {
            sinon.stub(UserService, 'getAllUsers').resolves([{ id: '1', email: 'test@user.com' }]);

            await UserController.getAllUsers(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ id: '1', email: 'test@user.com' }])).to.be.true;
        });

        it('should handle error when retrieving all users', async () => {
            sinon.stub(UserService, 'getAllUsers').rejects(new Error('Database error'));

            await UserController.getAllUsers(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Database error' })).to.be.true;
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID successfully', async () => {
            sinon.stub(UserService, 'getUserById').resolves({ id: '12345', email: 'test@user.com' });

            await UserController.getUserById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ id: '12345', email: 'test@user.com' })).to.be.true;
        });

        it('should handle error when user not found', async () => {
            sinon.stub(UserService, 'getUserById').rejects(new Error('User not found'));

            await UserController.getUserById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'User not found' })).to.be.true;
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            sinon.stub(UserService, 'updateUser').resolves({ id: '12345', email: 'test@user.com' });
            req.params = { id: '12345' };

            await UserController.updateUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "User updated successfully" })).to.be.true;
        });

        it('should handle errors when updating user', async () => {
            sinon.stub(UserService, 'updateUser').rejects(new Error('Update failed'));

            await UserController.updateUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Update failed' })).to.be.true;
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            sinon.stub(UserService, 'deleteUser').resolves();
            req.params = { id: '12345' };

            await UserController.deleteUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "User deleted successfully" })).to.be.true;
        });

        it('should handle errors when deleting user', async () => {
            sinon.stub(UserService, 'deleteUser').rejects(new Error('Deletion failed'));

            await UserController.deleteUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Deletion failed' })).to.be.true;
        });
    });

    describe('sendOTP', () => {
        it('should send OTP successfully', async () => {
            sinon.stub(UserService, 'sendOTP').resolves({ success: true });
            req.body = { email: 'test@user.com' };

            await UserController.sendOTP(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ success: true })).to.be.true;
        });

        it('should handle errors when sending OTP', async () => {
            sinon.stub(UserService, 'sendOTP').rejects(new Error('Failed to send OTP'));

            await UserController.sendOTP(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Failed to send OTP' })).to.be.true;
        });
    });

    describe('verifyOTP', () => {
        it('should verify OTP successfully', async () => {
            sinon.stub(UserService, 'verifyOTP').resolves({ success: true });
            req.body = { email: 'test@user.com', otp: '123456', newPassword: 'password123' };

            await UserController.verifyOTP(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ success: true })).to.be.true;
        });

        it('should handle errors when verifying OTP', async () => {
            sinon.stub(UserService, 'verifyOTP').rejects(new Error('Invalid OTP'));

            await UserController.verifyOTP(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ error: 'Invalid OTP' })).to.be.true;
        });
    });
});
