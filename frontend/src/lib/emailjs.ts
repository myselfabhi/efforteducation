import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_w7aecsh';
const EMAILJS_TEMPLATE_ID_CONTACT = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT || 'template_w2ld6p4';
const EMAILJS_TEMPLATE_ID_AUTOREPLY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY || 'template_qfevr9q';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'ltMNM8tfLpmo3M1wa';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  from_name: string;
  from_email: string;
  phone?: string;
  interest: string;
  message: string;
  to_name: string;
}

export const sendContactEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const templateParams = {
      from_name: data.from_name,
      from_email: data.from_email,
      phone: data.phone || 'Not provided',
      interest: data.interest,
      message: data.message,
      to_name: 'Effort Education Team',
      reply_to: data.from_email,
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONTACT,
      templateParams
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const sendAutoReplyEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_name: data.from_name,
      to_email: data.from_email,
      from_name: 'Effort Education Team',
      message: `Thank you for contacting Effort Education! We have received your inquiry about ${data.interest} and will get back to you within 24 hours.`,
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_AUTOREPLY,
      templateParams
    );

    console.log('Auto-reply sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return false;
  }
};
