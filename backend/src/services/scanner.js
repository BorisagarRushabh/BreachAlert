class ScannerService {
  constructor() {
    this.scanHistory = new Map();
    this.monitoredEmails = new Map(); // Add monitored emails storage
    this.breachDatabase = this.initializeBreachDatabase();
  }

  // Add method to update monitored emails
  updateMonitoredEmail(email, scanResult) {
    const monitoredEmail = {
      email: email,
      status: 'active',
      breaches: scanResult.breaches,
      breachesFound: scanResult.breachesFound, // Keep this consistent
      lastScanned: new Date().toISOString(),
      securityScore: scanResult.securityScore,
      riskLevel: scanResult.riskLevel
    };
    
    this.monitoredEmails.set(email, monitoredEmail);
    return monitoredEmail;
  }

  // Get all monitored emails for table display
  getMonitoredEmails() {
    return Array.from(this.monitoredEmails.values());
  }

  // Modified performScan to update monitored emails
  async performScan(email, userId = null) {
    try {
      console.log(`🎯 Starting breach scan for: ${email}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const breaches = this.findBreachesForEmail(email);
      const securityScore = this.calculateSecurityScore(breaches);
      const recommendations = this.generateRecommendations(breaches);
      
      const scanResult = {
        email: email,
        breachesFound: breaches.length, // This MUST match breaches.length
        totalExposedRecords: breaches.reduce((sum, breach) => sum + breach.pwnCount, 0),
        breaches: breaches,
        securityScore: securityScore,
        status: breaches.length > 0 ? 'compromised' : 'clean',
        riskLevel: this.calculateRiskLevel(securityScore),
        recommendations: recommendations,
        source: 'BreachAlert Security Database',
        lastChecked: new Date().toISOString(),
        scanId: this.generateScanId()
      };
      
      // Update both scan history AND monitored emails
      this.scanHistory.set(email, {
        ...scanResult,
        scannedAt: new Date()
      });

      // CRITICAL: Update monitored emails with the same data
      this.updateMonitoredEmail(email, scanResult);

      console.log(`✅ Scan completed: ${scanResult.breachesFound} breaches found for ${email}`);
      console.log(`📊 Verification - breachesFound: ${scanResult.breachesFound}, actual breaches: ${scanResult.breaches.length}`);
      
      return scanResult;
      
    } catch (error) {
      console.error('❌ Scan failed:', error);
      
      return {
        email: email,
        breachesFound: 0,
        breaches: [],
        securityScore: 0,
        status: 'error',
        riskLevel: 'unknown',
        recommendations: ["Scan failed. Please try again."],
        source: 'Error',
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }

  // Add email to monitoring
  addMonitoredEmail(email) {
    const initialData = {
      email: email,
      status: 'active',
      breaches: [],
      breachesFound: 0,
      lastScanned: new Date().toISOString(),
      securityScore: 100,
      riskLevel: 'low'
    };
    
    this.monitoredEmails.set(email, initialData);
    return initialData;
  }

  // Remove email from monitoring
  removeMonitoredEmail(email) {
    this.monitoredEmails.delete(email);
  }
}

export default new ScannerService();