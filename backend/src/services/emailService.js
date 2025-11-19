// Mock email service for development
export const sendBreachAlert = async (userEmail, breaches) => {
  try {
    console.log(`📧 [MOCK] Breach alert would be sent to: ${userEmail}`);
    console.log(`📧 [MOCK] Breaches found: ${breaches.length}`);
    
    breaches.forEach(breach => {
      console.log(`📧 [MOCK] - ${breach.Name}: ${breach.Description}`);
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send breach alert:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log(`📧 [MOCK] Welcome email would be sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};