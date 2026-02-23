const express = require('express');
const cors = require('cors');
const app = express();

// --- Middleware ---

// 1. Enable CORS for all routes and all origins.
// This will automatically handle preflight 'OPTIONS' requests.
app.use(cors());

// 2. Enable the Express JSON body parser.
app.use(express.json());


// --- Import ALL Route Files ---
const authRoutes = require('./src/api/routes/auth.routes');
const miniciteRoutes = require('./src/api/routes/minicite.routes');
const roomRoutes = require('./src/api/routes/room.routes');
const issueRoutes = require('./src/api/routes/issue.routes');
const myRoutes = require('./src/api/routes/my.routes');
const landlordPaymentRoutes = require('./src/api/routes/landlord-payment.routes');
const sessionPaymentRoutes = require('./src/api/routes/session-payment.routes');
const billingRoutes = require('./src/api/routes/billing.routes');
const myBillingRoutes = require('./src/api/routes/my-billing.routes');
const landlordTenantRoutes = require('./src/api/routes/landlord-tenant.routes');
const tenantRoutes = require('./src/api/routes/tenant.routes');

// --- Mount ALL Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/minicites', miniciteRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/my', myRoutes);
app.use('/api/landlord-payments', landlordPaymentRoutes);
app.use('/api/sessions', sessionPaymentRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/my-billing', myBillingRoutes);
app.use('/api/landlord-tenants', landlordTenantRoutes);
app.use('/api/tenants', tenantRoutes);

// --- Basic Welcome Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bantus Rental API!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


module.exports = app;
