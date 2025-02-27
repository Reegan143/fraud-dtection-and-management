const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const VendorRepository = require('../repositories/vendorRepository');
const VendorModel = require('../models/vendorModel');
const DisputesModel = require('../models/disputeModel');
const NotificationModel = require('../models/noticationModel');
const UserModel = require('../models/userModel');

describe('VendorRepository Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset mocks after each test
    });

    describe('findVendorByEmail', () => {
        it('should find a vendor by email', async () => {
            const mockVendor = { email: 'vendor@test.com', vendorName: 'Vendor One' };
            sinon.stub(UserModel, 'findOne').resolves(mockVendor);

            const result = await VendorRepository.findVendorByEmail('vendor@test.com');
            expect(result).to.deep.equal(mockVendor);
        });

        it('should return null if vendor is not found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await VendorRepository.findVendorByEmail('unknown@test.com');
            expect(result).to.be.null;
        });
    });

    describe('findVendorByName', () => {
        it('should find a vendor by name', async () => {
            const mockVendor = { vendorName: 'Vendor One', email: 'vendor@test.com' };
            sinon.stub(UserModel, 'findOne').resolves(mockVendor);

            const result = await VendorRepository.findVendorByName('Vendor One');
            expect(result).to.deep.equal(mockVendor);
        });

        it('should return null if vendor is not found', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const result = await VendorRepository.findVendorByName('Unknown Vendor');
            expect(result).to.be.null;
        });
    });

    describe('updateVendorApiKey', () => {
        it('should update vendor API key successfully', async () => {
            const mockVendor = { vendorName: 'Vendor One', apiKey: 'new-api-key' };
            sinon.stub(VendorModel, 'findOneAndUpdate').resolves(mockVendor);

            const result = await VendorRepository.updateVendorApiKey('Vendor One', 'new-api-key');
            expect(result).to.deep.equal(mockVendor);
        });

        it('should return null if vendor is not found', async () => {
            sinon.stub(VendorModel, 'findOneAndUpdate').resolves(null);

            const result = await VendorRepository.updateVendorApiKey('Unknown Vendor', 'new-api-key');
            expect(result).to.be.null;
        });
    });

    describe('findDisputeById', () => {
        it('should find a dispute by ID', async () => {
            const mockDispute = { _id: '12345', status: 'pending' };
            sinon.stub(DisputesModel, 'findById').resolves(mockDispute);

            const result = await VendorRepository.findDisputeById('12345');
            expect(result).to.deep.equal(mockDispute);
        });

        it('should return null if dispute is not found', async () => {
            sinon.stub(DisputesModel, 'findById').resolves(null);

            const result = await VendorRepository.findDisputeById('99999');
            expect(result).to.be.null;
        });
    });

    describe('saveDispute', () => {
        it('should save a dispute successfully', async () => {
            const mockDispute = { _id: '12345', status: 'pending' };
            sinon.stub(mockDispute, 'save').resolves(mockDispute);

            const result = await VendorRepository.saveDispute(mockDispute);
            expect(result).to.deep.equal(mockDispute);
        });
    });

    describe('createNotification', () => {
        it('should create a notification successfully', async () => {
            const mockNotification = { email: 'vendor@test.com', message: 'You have a new dispute.' };
            sinon.stub(NotificationModel, 'create').resolves(mockNotification);

            const result = await VendorRepository.createNotification(mockNotification);
            expect(result).to.deep.equal(mockNotification);
        });

        it('should return null if notification creation fails', async () => {
            sinon.stub(NotificationModel, 'create').rejects(new Error('Database Error'));

            try {
                await VendorRepository.createNotification({ email: 'vendor@test.com', message: 'Error test' });
            } catch (error) {
                expect(error.message).to.equal('Database Error');
            }
        });
    });
});
