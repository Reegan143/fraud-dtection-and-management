const VendorModel = require('../models/vendorModel');
const DisputesModel = require('../models/disputeModel');
const NotificationModel = require('../models/noticationModel');
const UserModel = require('../models/userModel');

class VendorRepository {

    async findAllVendors() {
        return await UserModel.find({role : "vendor"});
    }
    async findVendorByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async findVendorByName(vendorName) {
        return await UserModel.findOne({ vendorName });
    }

    async updateVendorApiKey(vendorName, apiKey) {
        return await VendorModel.findOneAndUpdate({ vendorName }, { apiKey }, { new: true });
    }

    async findDisputeById(disputeId) {
        return await DisputesModel.findById(disputeId);
    }

    async saveDispute(dispute) {
        return await dispute.save();
    }

    async createNotification(notificationData) {
        return await NotificationModel.create(notificationData);
    }
}

module.exports = new VendorRepository();
