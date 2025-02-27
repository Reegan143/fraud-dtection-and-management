const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const ChatbotController = require('../controllers/chatbotController');
const ChatbotService = require('../services/chatbotServices');

describe('ChatbotController Tests', () => {
    let req, res, errorStub;

    beforeEach(() => {
        req = {
            body: {},
            user: { userId: '12345' } // Mock authenticated user
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        //  Suppress console.error logs to keep test output clean
        errorStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
        sinon.restore(); //  Restore all mocks
    });

    describe('processMessage', () => {
        it('should process a chatbot message successfully', async () => {
            req.body = { message: "Hello, chatbot!" };
            sinon.stub(ChatbotService, 'processMessage').resolves({ reply: "Hello, user!" });

            await ChatbotController.processMessage(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ reply: "Hello, user!" })).to.be.true;
        });

        it('should return 401 if user is not authenticated', async () => {
            req.user = null;

            await ChatbotController.processMessage(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: "You must be logged in to use the chatbot." })).to.be.true;
        });

        it('should handle chatbot errors properly', async () => {
            sinon.stub(ChatbotService, 'processMessage').rejects(new Error('Service Error'));

            await ChatbotController.processMessage(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Sorry, I'm having trouble processing your message right now." })).to.be.false;
        });
    });

    describe('resetConversation', () => {
        it('should reset the chatbot conversation successfully', async () => {
            sinon.stub(ChatbotService, 'startDisputeConversation').resolves({ success: true });

            await ChatbotController.resetConversation(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ success: true })).to.be.true;
        });

        it('should return 401 if user is not authenticated', async () => {
            req.user = null;

            await ChatbotController.resetConversation(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: "You must be logged in to use the chatbot." })).to.be.true;
        });

        it('should handle chatbot reset errors properly', async () => {
            sinon.stub(ChatbotService, 'startDisputeConversation').rejects(new Error('Reset Error'));

            await ChatbotController.resetConversation(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Error resetting conversation. Please try again." })).to.be.true;
        });
    });

    describe('getConversationStatus', () => {
        it('should return conversation status and messages successfully', async () => {
            sinon.stub(ChatbotService, 'hasActiveConversation').resolves(true);
            sinon.stub(ChatbotService, 'getConversationMessages').resolves([{ text: "Test message" }]);

            await ChatbotController.getConversationStatus(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ hasActiveConversation: true, messages: [{ text: "Test message" }] })).to.be.true;
        });

        it('should return empty conversation if user is not authenticated', async () => {
            req.user = null;

            await ChatbotController.getConversationStatus(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ hasActiveConversation: false, messages: [] })).to.be.true;
        });

        it('should handle errors when retrieving conversation status', async () => {
            sinon.stub(ChatbotService, 'hasActiveConversation').rejects(new Error('Chatbot error'));

            await ChatbotController.getConversationStatus(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ hasActiveConversation: false, messages: [] })).to.be.true;
        });
    });
});
