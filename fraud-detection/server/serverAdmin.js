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

app.use('/api/admin', adminRoutes);
const PORT = process.env.ADMINPORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
