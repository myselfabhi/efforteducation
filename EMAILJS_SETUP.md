# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Templates

### Template 1: Contact Form (Admin Notification)
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template:

**Subject:** New Contact Form Submission - {{from_name}}

**Content:**
```
Hello Effort Education Team,

You have received a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Interest: {{interest}}

Message:
{{message}}

Please respond to this inquiry within 24 hours.

Best regards,
Effort Education Website
```

4. Save the template and note down the **Template ID**

### Template 2: Auto-Reply (User Confirmation)
1. Create another template for auto-reply
2. Use this template:

**Subject:** Thank you for contacting Effort Education!

**Content:**
```
Dear {{to_name}},

Thank you for contacting Effort Education! We have received your inquiry and will get back to you within 24 hours.

Your inquiry details:
- Interest: {{interest}}
- Message: {{message}}

If you have any urgent questions, please call us at +91 98765 43210.

Best regards,
Effort Education Team
```

## Step 4: Get Public Key
1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** in the API Keys section

## Step 5: Update Environment Variables
1. Open `.env.local` file in your project
2. Replace the placeholder values:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_contact_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## Step 6: Test the Form
1. Start your development server: `npm run dev`
2. Go to your contact form
3. Fill out and submit the form
4. Check your email for the notification
5. Check the user's email for the auto-reply

## Troubleshooting
- Make sure all environment variables are set correctly
- Check that your email service is properly connected
- Verify template variables match the code
- Check browser console for any errors

## Free Tier Limits
- 200 emails per month
- Perfect for small to medium websites
- Upgrade to paid plan for higher limits
