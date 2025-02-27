const VendorRepository = require('../repositories/vendorRepository');
const { sendMail } = require('../utils/sendMail');
const UserRepository = require('../repositories/userRepository');
const jet = require('jsonwebtoken');
const vendorRepository = require('../repositories/vendorRepository');

class VendorService {
    async getVendorById(email) {
        const vendor = await VendorRepository.findVendorByEmail(email);
        if (!vendor) throw new Error("Vendor not found");
        return vendor;
    }

    async respondToDispute(disputeId, vendorResponse) {
        const dispute = await VendorRepository.findDisputeById(disputeId);
        if (!dispute) throw new Error("Dispute not found");
        const user = await UserRepository.findUserByEmail(dispute.email);
        if (!user) throw new Error("User not found");

        if (dispute.vendorResponse) throw new Error("Response already submitted for this dispute");

        dispute.vendorResponse = vendorResponse;
        dispute.status = 'closed';
        dispute.resolvedAt = new Date();
        await VendorRepository.saveDispute(dispute);


        await sendMail(dispute.email, dispute.ticketNumber, user.userName, dispute.amount, `Your dispute has been resolved. Vendor response: ${vendorResponse}`, 'closed', dispute.vendorName);

        await VendorRepository.createNotification({
            email: dispute.email,
            ticketNumber: dispute.ticketNumber,
            userName: user.userName,
            messages: `Your dispute has been resolved. Vendor response: ${vendorResponse}`,
            complaintType: 'resolved'
        });

        return dispute;
    }


    async getApiKey(email) {

        const vendor = await VendorRepository.findVendorByEmail(email);
        if (!vendor || !vendor.apiKey) throw new Error("API Key not found");
        return vendor.apiKey;
    }

    async fetchTransactionData(vendorName, transactionId, authorization) {
        const vendor = await VendorRepository.findVendorByName(vendorName);
        if (!vendor || !vendor.apiKey) throw new Error("API Key not found. Please request an API Key first.");

        const response = await axios.get(`http://localhost:5001/api/card-network/transactions/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${authorization.split(' ')[1]}`,
                'x-api-key': vendor.apiKey
            }
        });

        return response.data;
    }

    async decodeApiKey(apiKey, email){
        const vendor = await vendorRepository.findVendorByEmail(email)
        if(!vendor ||!vendor.apiKey) throw new Error("API Key not found. Please request an API Key first.");
        
        const decodedApi = await jet.verify(apiKey, vendor.vendorName);
        if(!decodedApi) throw new Error("API Key is not valid. Please request it again")
            
        return decodedApi;
    }

    async getAllVendor() {
        return await VendorRepository.findAllVendors();
    }
}

module.exports = new VendorService();
