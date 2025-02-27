const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const DisputesController = require('../controllers/disputeController');
const DisputesService = require('../services/disputeServices');

describe('DisputesController Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: { email: 'user@test.com', userId: '12345' } // Mock authenticated user
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('registerDispute', () => {
        it('should register a dispute successfully', async () => {
            sinon.stub(DisputesService, 'registerDispute').resolves({ ticketNumber: 'D123', status: 'submitted' });

            await DisputesController.registerDispute(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Complaint registered successfully!' })).to.be.true;
        });

        it('should handle errors when registering dispute', async () => {
            sinon.stub(DisputesService, 'registerDispute').rejects(new Error('Database Error'));

            await DisputesController.registerDispute(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Database Error' })).to.be.true;
        });
    });

    describe('getUserDisputes', () => {
        it('should return user disputes successfully', async () => {
            sinon.stub(DisputesService, 'getUserDisputes').resolves([{ ticketNumber: 'D123', status: 'pending' }]);

            await DisputesController.getUserDisputes(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ ticketNumber: 'D123', status: 'pending' }])).to.be.true;
        });

        it('should handle error while fetching user disputes', async () => {
            sinon.stub(DisputesService, 'getUserDisputes').rejects(new Error('Failed to fetch disputes'));

            await DisputesController.getUserDisputes(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Failed to fetch disputes' })).to.be.true;
        });
    });

    describe('getDisputeById', () => {
        it('should return a dispute by ticket number successfully', async () => {
            req.body = { ticketNumber: 'D123' };
            sinon.stub(DisputesService, 'getDisputeByTicketNumber').resolves({ ticketNumber: 'D123', status: 'resolved' });

            await DisputesController.getDisputeById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ ticketNumber: 'D123', status: 'resolved' })).to.be.true;
        });

        it('should handle error if dispute is not found', async () => {
            sinon.stub(DisputesService, 'getDisputeByTicketNumber').rejects(new Error('Dispute not found'));

            await DisputesController.getDisputeById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Failed to fetch dispute details' })).to.be.true;
        });
    });

    describe('getDisputeByVendorName', () => {
        it('should return disputes by vendor name successfully', async () => {
            req.params.vendorName = 'TestVendor';
            sinon.stub(DisputesService, 'getDisputeByVendorName').resolves([{ ticketNumber: 'D456', status: 'investigating' }]);

            await DisputesController.getDisputeByVendorName(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ ticketNumber: 'D456', status: 'investigating' }])).to.be.true;
        });

        it('should handle error if fetching disputes by vendor name fails', async () => {
            sinon.stub(DisputesService, 'getDisputeByVendorName').rejects(new Error('Server error'));

            await DisputesController.getDisputeByVendorName(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
        });
    });
});
