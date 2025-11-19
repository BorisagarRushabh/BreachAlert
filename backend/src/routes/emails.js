import express from 'express';
import ScannerService from '../services/scanner.js';

const router = express.Router();

// In-memory storage for emails (replace with database later)
let monitoredEmails = [];

// GET /api/emails - Get all monitored emails
router.get('/', (req, res) => {
  console.log('📧 Fetching monitored emails:', monitoredEmails.length);
  res.json(monitoredEmails);
});

// POST /api/emails - Add email to monitoring
router.post('/', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    if (monitoredEmails.find(e => e.email === email)) {
      return res.status(400).json({ error: 'Email already being monitored' });
    }

    const monitoredEmail = {
      id: Date.now().toString(),
      email,
      status: 'active',
      breachCount: 0,
      securityScore: 100,
      lastScanned: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    monitoredEmails.push(monitoredEmail);
    
    console.log('✅ Email added to monitoring:', email);
    res.json(monitoredEmail);

  } catch (error) {
    console.error('❌ Error adding email:', error);
    res.status(500).json({ error: 'Failed to add email' });
  }
});

// DELETE /api/emails/:email - Remove email from monitoring
router.delete('/:email', (req, res) => {
  try {
    const { email } = req.params;
    const decodedEmail = decodeURIComponent(email);
    
    console.log('🗑️ Removing email from monitoring:', decodedEmail);
    
    const initialLength = monitoredEmails.length;
    monitoredEmails = monitoredEmails.filter(e => e.email !== decodedEmail);
    
    if (monitoredEmails.length === initialLength) {
      return res.status(404).json({ error: 'Email not found' });
    }

    console.log('✅ Email removed successfully');
    res.json({ 
      success: true, 
      message: 'Email removed from monitoring' 
    });

  } catch (error) {
    console.error('❌ Error removing email:', error);
    res.status(500).json({ error: 'Failed to remove email' });
  }
});

// Update email after scan
router.put('/:email/scan-result', (req, res) => {
  try {
    const { email } = req.params;
    const { breachCount, securityScore, lastScanned } = req.body;
    
    const emailToUpdate = monitoredEmails.find(e => e.email === email);
    if (emailToUpdate) {
      emailToUpdate.breachCount = breachCount || 0;
      emailToUpdate.securityScore = securityScore || 100;
      emailToUpdate.lastScanned = lastScanned || new Date().toISOString();
    }
    
    res.json(emailToUpdate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;