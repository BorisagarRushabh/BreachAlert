import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage
const users = [];
const monitoredEmails = [];

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BreachAlert Backend is running!',
    mode: 'Development (No Database)',
    rapidApi: process.env.RAPIDAPI_KEY ? 'Configured' : 'Not configured'
  });
});

// Auth routes with debug logging
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('📝 Register attempt:', { name, email });
  
  if (users.find(u => u.email === email)) {
    console.log('❌ User already exists:', email);
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const user = {
    id: Date.now().toString(),
    name,
    email,
    subscription: { plan: 'free', status: 'active' }
  };
  
  users.push(user);
  
  console.log('✅ User registered:', user);
  console.log('📊 Total users:', users.length);
  
  res.json({
    message: 'User created successfully',
    user: { id: user.id, name: user.name, email: user.email, subscription: user.subscription }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email });
  
  const user = users.find(u => u.email === email);
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  console.log('✅ User logged in:', user);
  console.log('📊 Total users:', users.length);
  
  res.json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email, subscription: user.subscription }
  });
});

// Email monitoring routes
app.post('/api/emails', (req, res) => {
  const { email } = req.body;
  
  console.log('📧 Add email request:', email);
  
  // Check if email already exists
  if (monitoredEmails.find(e => e.email === email)) {
    return res.status(400).json({ error: 'Email already being monitored' });
  }

  const monitoredEmail = {
    id: Date.now().toString(),
    email,
    status: 'active',
    breachCount: 0, // Start with 0 breaches
    securityScore: 100, // Start with perfect score
    lastScanned: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  monitoredEmails.push(monitoredEmail);
  
  console.log('✅ Email added to monitoring:', email);
  console.log('📊 Total monitored emails:', monitoredEmails.length);
  
  res.json(monitoredEmail);
});

app.get('/api/emails', (req, res) => {
  console.log('📧 Fetching monitored emails:', monitoredEmails.length);
  res.json(monitoredEmails);
});

// DELETE email from monitoring
app.delete('/api/emails/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email);
  
  console.log('🗑️ Delete email request:', email);
  
  const initialLength = monitoredEmails.length;
  const filteredEmails = monitoredEmails.filter(e => e.email !== email);
  
  if (filteredEmails.length === initialLength) {
    console.log('❌ Email not found for deletion:', email);
    return res.status(404).json({ error: 'Email not found' });
  }

  // Update the monitoredEmails array
  monitoredEmails.length = 0;
  monitoredEmails.push(...filteredEmails);
  
  console.log('✅ Email deleted successfully:', email);
  console.log('📊 Remaining monitored emails:', monitoredEmails.length);
  
  res.json({ 
    success: true, 
    message: 'Email removed from monitoring' 
  });
});

// Update email scan result
app.put('/api/emails/:email/scan-result', (req, res) => {
  const email = req.params.email;
  const { breachCount, securityScore } = req.body;
  
  console.log('🔄 Update scan result for:', email, { breachCount, securityScore });
  
  const emailToUpdate = monitoredEmails.find(e => e.email === email);
  if (emailToUpdate) {
    emailToUpdate.breachCount = breachCount || 0;
    emailToUpdate.securityScore = securityScore || 100;
    emailToUpdate.lastScanned = new Date().toISOString();
    
    console.log('✅ Email updated:', emailToUpdate);
    res.json(emailToUpdate);
  } else {
    res.status(404).json({ error: 'Email not found' });
  }
});

// Scan routes
app.post('/api/scans/scan', (req, res) => {
  const { email } = req.body;
  
  console.log('🔍 Scan request for:', email);
  
  if (!email) {
    return res.status(400).json({ 
      success: false,
      error: 'Email is required' 
    });
  }

  // Simulate scanning with realistic data
  const hasBreaches = Math.random() > 0.4; // 60% chance of breaches
  
  const breaches = hasBreaches ? [
    {
      name: "Adobe",
      title: "Adobe Breach 2013",
      breachDate: "2013-10-04",
      description: "In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, encrypted password and a password hint in plain text.",
      dataClasses: ["Email addresses", "Passwords", "Password hints"],
      pwnCount: 152445165,
      isVerified: true,
      domain: "adobe.com",
      severity: "high"
    },
    {
      name: "LinkedIn",
      title: "LinkedIn Breach 2012", 
      breachDate: "2012-05-05",
      description: "In May 2016, LinkedIn had 164 million email addresses and passwords exposed. Originally hacked in 2012, the data remained private until 2016 when it was put up for sale on a dark market.",
      dataClasses: ["Email addresses", "Passwords"],
      pwnCount: 164611595,
      isVerified: true,
      domain: "linkedin.com",
      severity: "high"
    }
  ] : [];

  const securityScore = hasBreaches ? 
    Math.floor(30 + Math.random() * 40) : // 30-70 for compromised
    Math.floor(80 + Math.random() * 20);  // 80-100 for clean

  const scanResult = {
    email: email,
    breachesFound: breaches.length,
    totalExposedRecords: breaches.reduce((sum, breach) => sum + breach.pwnCount, 0),
    breaches: breaches,
    securityScore: securityScore,
    status: breaches.length > 0 ? 'compromised' : 'clean',
    riskLevel: securityScore >= 80 ? 'low' : securityScore >= 60 ? 'medium' : 'high',
    recommendations: breaches.length > 0 ? [
      "🚨 Change passwords for all affected accounts immediately",
      "Use unique passwords for each service",
      "Enable two-factor authentication"
    ] : [
      "Your email appears secure. Continue good security practices.",
      "Consider using a password manager",
      "Enable two-factor authentication on important accounts"
    ],
    source: 'BreachAlert Security Database',
    lastChecked: new Date().toISOString()
  };

  // Update the monitored email with scan results
  const monitoredEmail = monitoredEmails.find(e => e.email === email);
  if (monitoredEmail) {
    monitoredEmail.breachCount = breaches.length;
    monitoredEmail.securityScore = securityScore;
    monitoredEmail.lastScanned = new Date().toISOString();
    console.log('✅ Updated monitored email with scan results');
  }

  console.log(`✅ Scan completed: ${breaches.length} breaches found for ${email}`);
  
  res.json({
    success: true,
    data: scanResult
  });
});

// Legacy endpoint for backward compatibility
app.get('/api/scans/test-breach/:email', (req, res) => {
  const { email } = req.params;
  
  console.log('🔍 Legacy scan request for:', email);
  
  const hasBreaches = Math.random() > 0.5;
  const breaches = hasBreaches ? [
    {
      "Name": "Adobe",
      "Title": "Adobe Breach",
      "BreachDate": "2013-10-04",
      "Description": "In October 2013, 153 million Adobe accounts were breached.",
      "DataClasses": ["Email addresses", "Passwords", "Usernames"],
      "PwnCount": 152445165,
      "IsVerified": true
    }
  ] : [];
  
  res.json({
    email: email,
    breachesFound: breaches.length,
    breaches: breaches,
    source: 'Mock Data'
  });
});

// Free scan endpoint
app.post('/api/scans/free-scan', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  console.log('🔍 Free scan request for:', email);

  const breaches = [
    {
      name: "TestBreach",
      title: "Sample Data Breach",
      breachDate: "2023-01-01",
      description: "This is test data. Add RapidAPI key for real breach data.",
      dataClasses: ["Email addresses", "Passwords"],
      pwnCount: 500000,
      isVerified: false,
      severity: "medium"
    }
  ];
  
  res.json({
    success: true,
    data: {
      email: email,
      breachesFound: breaches.length,
      breaches: breaches,
      securityScore: 65,
      status: 'compromised',
      source: 'Free Scan',
      lastChecked: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log(`📧 Emails: http://localhost:${PORT}/api/emails`);
  console.log(`🔍 Scan: POST http://localhost:${PORT}/api/scans/scan`);
  console.log(`🗑️ Delete: DELETE http://localhost:${PORT}/api/emails/:email`);
  console.log(`👤 Users: ${users.length}, Emails: ${monitoredEmails.length}`);
});