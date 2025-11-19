// Simple service that returns mock data for now
class HIBPService {
  async checkEmail(email) {
    try {
      console.log(`🔍 Checking breaches for: ${email}`);
      
      // For now, return mock data
      // We'll integrate RapidAPI later
      return this.getMockBreaches();
    } catch (error) {
      console.error('Error checking email:', error);
      return this.getMockBreaches();
    }
  }

  getMockBreaches() {
    // Return realistic mock data
    return [
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
  }
}

export default new HIBPService();