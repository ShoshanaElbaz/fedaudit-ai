const express = require('express');
const router  = express.Router();

const upload = require('../middleware/upload');

const {uploadInvoice} = require('../controllers/InvoiceController');

// POST 
router.post('/upload', upload.single('invoice'), uploadInvoice);

module.exports = router;
