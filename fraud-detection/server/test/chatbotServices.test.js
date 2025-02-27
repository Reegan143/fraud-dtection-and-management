const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const ChatbotService = require('../services/chatbotServices');
const UserRepository = require('../repositories/userRepository');
const DisputesService = require('../services/disputeServices');

describe('ChatbotService Tests', () => {
    let userId = 'user123';

    beforeEach(() => {
        ChatbotService.conversations = {}; // Reset chatbot conversation state
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('processMessage', () => {
        it('should start a new dispute conversation if user has no active session', async () => {
            sinon.stub(UserRepository, 'findUserById').resolves({ email: 'user@test.com' });

            const response = await ChatbotService.processMessage(userId, 'Hello');

            expect(response.message).to.include("Welcome to the Dispute Registration Assistant");
        });

        it('should process a message and return a bot response', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'start' };

            const response = await ChatbotService.processMessage(userId, 'yes');

            expect(response.message).to.include("What digital channel was used for this transaction?");
        });
    });

    describe('startDisputeConversation', () => {
        it('should initialize a new dispute conversation', async () => {
            sinon.stub(UserRepository, 'findUserById').resolves({ email: 'user@test.com' });

            const response = await ChatbotService.startDisputeConversation(userId);

            expect(response.message).to.include("Would you like to register a new dispute?");
        });

        it('should return error message if user not found', async () => {
            sinon.stub(UserRepository, 'findUserById').resolves(null);

            const response = await ChatbotService.startDisputeConversation(userId);

            expect(response.message).to.include("User not found. Please log in again.");
        });
    });

    describe('message step handlers', () => {
        it('should validate and proceed from start step', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'start' };

            const response = await ChatbotService.processMessage(userId, 'yes');

            expect(response.message).to.include("What digital channel was used for this transaction?");
        });

        it('should validate and proceed from digital channel step', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'digitalChannel', formData: {} };

            const response = await ChatbotService.processMessage(userId, 'Mobile Banking');

            expect(response.message).to.include("What type of complaint is this?");
        });

        it('should validate transaction ID correctly', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'transactionId', formData: {} };

            const response = await ChatbotService.processMessage(userId, '1234567890');

            expect(response.message).to.include("Please describe the issue in detail:");
        });

        it('should reject invalid transaction ID', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'transactionId', formData: {} };

            const response = await ChatbotService.processMessage(userId, 'abc');

            expect(response.message).to.include("Transaction ID must be a 10-digit number.");
        });

        it('should validate debit card number correctly', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'debitCardNumber', formData: {} };

            const response = await ChatbotService.processMessage(userId, '1234567812345678');

            expect(response.message).to.include("What was the transaction amount?");
        });

        it('should reject invalid debit card number', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'debitCardNumber', formData: {} };

            const response = await ChatbotService.processMessage(userId, 'abcd1234');

            expect(response.message).to.include("Debit card number must be a 16-digit number.");
        });

        it('should validate vendor choice correctly', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'vendorChoice', formData: {} };

            const response = await ChatbotService.processMessage(userId, 'yes');

            expect(response.message).to.include("Please provide the vendor name:");
        });

        it('should submit dispute successfully', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'vendorName', formData: {}, user: { email: 'user@test.com' } };
            sinon.stub(DisputesService, 'registerDispute').resolves({ ticketNumber: 'D123' });

            const response = await ChatbotService.processMessage(userId, 'Amazon');

            expect(response.message).to.include("Your dispute has been registered successfully.");
            expect(response.ticketNumber).to.equal('D123');
        });

        it('should handle error when registering dispute', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'vendorName', formData: {}, user: { email: 'user@test.com' } };
            sinon.stub(DisputesService, 'registerDispute').rejects(new Error("Failed to register dispute"));

            const response = await ChatbotService.processMessage(userId, 'Amazon');

            expect(response.message).to.include("Error registering dispute: Failed to register dispute");
        });
    });

    describe('conversation management', () => {
        it('should return true if conversation is active', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'start' };

            const result = await ChatbotService.hasActiveConversation(userId);

            expect(result).to.be.true;
        });

        it('should return false if conversation is not active', async () => {
            const result = await ChatbotService.hasActiveConversation(userId);

            expect(result).to.be.false;
        });

        it('should retrieve conversation messages', async () => {
            ChatbotService.conversations[userId] = {
                messageHistory: [
                    { text: 'Hello', sender: 'user' },
                    { text: 'Welcome!', sender: 'bot' }
                ]
            };

            const messages = await ChatbotService.getConversationMessages(userId);

            expect(messages).to.have.lengthOf(2);
        });

        it('should end conversation successfully', async () => {
            ChatbotService.conversations[userId] = { currentStep: 'start', formData: {} };

            const response = ChatbotService.endConversation(userId);

            expect(response.message).to.include("Thank you for using the Dispute Registration Assistant");
        });
    });
});
