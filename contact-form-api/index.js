const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 8080;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Contact Form API is running' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        success: false 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address',
        success: false 
      });
    }

    // Send notification to yourself
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Resend provides this for testing
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });

    // Send auto-reply to user
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Reaching Out!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>Your Team</p>
        </div>
      `
    });

    res.json({ 
      success: true,
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      success: false 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});