import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class RapidApiService {
  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY;
    this.baseURL = 'https://breachdirectory.p.rapidapi.com';
    this.headers = {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'breachdirectory.p.rapidapi.com'
    };
  }

  async checkEmailBreach(email) {
    try {
      if (!this.apiKey) {
        throw new Error('RapidAPI key not configured');
      }

      console.log(`🔍 Checking breaches for: ${email}`);
      
      const response = await axios.get(`${this.baseURL}/`, {
        headers: this.headers,
        params: {
          func: 'auto',
          term: email
        },
        timeout: 10000
      });

      return this.formatBreachData(response.data, email);
    } catch (error) {
      console.error('❌ RapidAPI Error:', error.response?.data || error.message);
      return this.getFallbackData(email, error);
    }
  }

  formatBreachData(apiData, email) {
    if (!apiData || !apiData.result) {
      return {
        email: email,
        breachesFound: 0,
        breaches: [],
        source: 'RapidAPI - No breaches found',
        status: 'clean'
      };
    }

    const breaches = apiData.result.map(breach => ({
      name: breach.name || 'Unknown Breach',
      title: breach.title || 'Data Breach',
      breachDate: breach.breach_date || 'Unknown Date',
      description: breach.description || 'Data exposure incident',
      dataClasses: breach.data_classes || ['Email addresses'],
      pwnCount: breach.pwn_count || 0,
      isVerified: breach.is_verified !== false,
      domain: breach.domain || 'multiple',
      severity: this.calculateSeverity(breach)
    }));

    return {
      email: email,
      breachesFound: breaches.length,
      totalExposedRecords: breaches.reduce((sum, breach) => sum + (breach.pwnCount || 0), 0),
      breaches: breaches,
      source: 'RapidAPI - BreachDirectory',
      status: breaches.length > 0 ? 'compromised' : 'clean',
      lastChecked: new Date().toISOString()
    };
  }

  calculateSeverity(breach) {
    let score = 0;
    const dataClasses = breach.data_classes || [];
    
    if (dataClasses.includes('Passwords')) score += 3;
    if (dataClasses.includes('CreditCards')) score += 4;
    if (dataClasses.includes('SocialSecurityNumbers')) score += 5;
    if (dataClasses.includes('PhoneNumbers')) score += 2;
    if (dataClasses.includes('Addresses')) score += 2;
    if (breach.is_verified) score += 2;
    if (breach.pwn_count > 1000000) score += 2;
    if (breach.pwn_count > 10000000) score += 3;

    if (score >= 8) return 'critical';
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  getFallbackData(email, error) {
    console.log('🔄 Using fallback data for:', email);
    
    // Fallback mock data when API fails
    const mockBreaches = [
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
    ];

    const hasBreaches = Math.random() > 0.3; // 70% chance of breaches in fallback

    return {
      email: email,
      breachesFound: hasBreaches ? mockBreaches.length : 0,
      totalExposedRecords: hasBreaches ? mockBreaches.reduce((sum, b) => sum + b.pwnCount, 0) : 0,
      breaches: hasBreaches ? mockBreaches : [],
      source: error ? `Fallback - ${error.message}` : 'Fallback - Mock Data',
      status: hasBreaches ? 'compromised' : 'clean',
      lastChecked: new Date().toISOString(),
      note: error ? 'API unavailable, showing sample data' : 'Using sample breach data'
    };
  }

  // Check multiple emails at once
  async checkMultipleEmails(emails) {
    const results = [];
    for (const email of emails) {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = await this.checkEmailBreach(email);
      results.push(result);
    }
    return results;
  }
}

export default new RapidApiService();