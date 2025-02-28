const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const vendorRoutes = require('./routes/vendorRoutes');


const app = express();
app.use(express.json());
app.use(cors())

connectDB();

app.use('/api/vendor', vendorRoutes)

const PORT = process.env.VENDORPORT || 8002;
app.listen(PORT, () => console.log(`Vendor Server running on port ${PORT}`));
