import express from 'express';
import ScannerService from '../services/scanner.js';

const router = express.Router();

// POST /api/scans/scan - Scan an email for breaches
router.post('/scan', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    console.log(`🔍 Scan request for: ${email}`);
    const scanResult = await ScannerService.performScan(email);

    res.json({
      success: true,
      data: scanResult
    });

  } catch (error) {
    console.error('❌ Scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/scans/test-breach/:email - Legacy endpoint for testing
router.get('/test-breach/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const scanResult = await ScannerService.performScan(email);
    
    res.json(scanResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/scans/free-scan - Public scanning
router.post('/free-scan', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const scanResult = await ScannerService.performScan(email);
    res.json({
      success: true,
      data: scanResult
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Scan service unavailable'
    });
  }
});

export default router;