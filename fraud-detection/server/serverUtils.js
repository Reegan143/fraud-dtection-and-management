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


const app = express();
app.use(express.json());
app.use(cors())

connectDB();



app.use('/api/disputes',disputeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userProfileRoutes);


const PORT = process.env.UTILSPORT || 8003;
app.listen(PORT, () => console.log(`Utils Server running on port ${PORT}`));
