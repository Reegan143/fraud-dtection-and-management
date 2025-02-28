const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path')
const userRoutes = require('./routes/userRoutes')
const disputeRoutes = require('./routes/disputeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
const userProfileRoutes = require('./routes/userProfileRoutes');
const transactionRoutes = require('./routes/transactionRoutes')
const vendorRoutes = require('./routes/vendorRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');


const app = express();
app.use(express.json());
app.use(cors())

connectDB();


const startUserServer = async () => {
    app.use('/api/user', userRoutes)
    app.use('/api/chatbot', chatbotRoutes);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`User Server running on port ${PORT}`));
}


const startAdminServer = async () => {
    app.use('/api/admin', adminRoutes);
    const PORT = process.env.ADMINPORT || 8001;
    app.listen(PORT, () => console.log(`Admin Server running on port ${PORT}`));

}

const startVendorServer = async () => {
    app.use('/api/vendor', vendorRoutes)

    const PORT = process.env.VENDORPORT || 8002;
    app.listen(PORT, () => console.log(`Vendor Server running on port ${PORT}`));

}

const startUtilsServer = async () => {
    app.use('/api/disputes',disputeRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/users', userProfileRoutes);
    app.use("/api/notifications", notificationRoutes);
    
    
    const PORT = process.env.UTILSPORT || 8003;
    app.listen(PORT, () => console.log(`Utils Server running on port ${PORT}`));

}


startUserServer()

// startAdminServer()

// startVendorServer()

// startUtilsServer()

