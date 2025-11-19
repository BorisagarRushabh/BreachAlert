import express from 'express';

const router = express.Router();

// Test API connection
router.get('/test-api', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint',
    rapidApi: process.env.RAPIDAPI_KEY ? 'Configured' : 'Not configured'
  });
});

// Test breach check
router.get('/test-breach/:email', (req, res) => {
  const breaches = [
    {
      "Name": "Adobe",
      "Title": "Adobe Breach", 
      "BreachDate": "2013-10-04",
      "Description": "In October 2013, 153 million Adobe accounts were breached.",
      "DataClasses": ["Email addresses", "Passwords", "Usernames"],
      "PwnCount": 152445165,
      "IsVerified": true
    },
    {
      "Name": "LinkedIn", 
      "Title": "LinkedIn Breach",
      "BreachDate": "2012-05-05", 
      "Description": "LinkedIn had 164 million email addresses and passwords exposed.",
      "DataClasses": ["Email addresses", "Passwords"],
      "PwnCount": 164611595,
      "IsVerified": true
    }
  ];
  
  res.json({
    email: req.params.email,
    breachesFound: breaches.length,
    breaches: breaches,
    timestamp: new Date().toISOString()
  });
});

// Free scan (no auth required)
router.post('/free-scan', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const breaches = [
    {
      "Name": "ExampleBreach",
      "Title": "Data Breach",
      "BreachDate": "2022-01-01", 
      "Description": "Sample breach data for testing",
      "DataClasses": ["Email addresses", "Passwords"],
      "PwnCount": 1000000,
      "IsVerified": true
    }
  ];
  
  res.json({
    email: email,
    breachesFound: breaches.length,
    breaches: breaches,
    message: breaches.length > 0 
      ? `⚠️ This email was found in ${breaches.length} data breaches` 
      : '✅ No known data breaches found for this email'
  });
});

export default router;