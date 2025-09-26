// Fallback email service for development/testing
export interface EmailData {
  from_name: string;
  from_email: string;
  phone?: string;
  interest: string;
  message: string;
  to_name: string;
}

export const sendContactEmail = async (data: EmailData): Promise<boolean> => {
  // Simulate email sending for development
  console.log('📧 Email would be sent with data:', {
    to: 'admin@efforteducation.com',
    subject: `New Contact Form Submission - ${data.from_name}`,
    body: `
Name: ${data.from_name}
Email: ${data.from_email}
Phone: ${data.phone || 'Not provided'}
Interest: ${data.interest}

Message:
${data.message}
    `
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate success (you can change this to false to test error handling)
  return true;
};

export const sendAutoReplyEmail = async (data: EmailData): Promise<boolean> => {
  // Simulate auto-reply sending for development
  console.log('📧 Auto-reply would be sent to:', data.from_email);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
};
