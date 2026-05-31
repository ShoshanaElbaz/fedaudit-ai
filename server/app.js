const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./src/presentation/routes/invoiceRoutes');
const errorHandler = require('./src/presentation/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/invoices', invoiceRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'FedAudit Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;