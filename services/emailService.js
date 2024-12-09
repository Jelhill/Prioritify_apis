import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';

dotenv.config();

const mailgun = new Mailgun(formData);
const EMAILSENDER = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

class EmailService {

  static sendTaskReminderEmail = async (email, taskTitle, taskDueTime) => {
    const subject = `Reminder: ${taskTitle} is due soon!`;
    const text = `Hello, this is a reminder that your task "${taskTitle}" is due at ${taskDueTime}. Please make sure to complete it on time.`;
    
    try {
      const emailResponse = await EMAILSENDER.messages.create(process.env.MAILGUN_DOMAIN, {
        from: 'noreply@your-domain.com',
        to: [email],
        subject: subject,
        text: text,
      });
      console.log('Email sent:', emailResponse);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // You can also include an HTML version if desired
  static sendTaskReminderEmailHtml = async (email, taskTitle, taskDueTime) => {
    const subject = `Reminder: ${taskTitle} is due soon!`;
    const html = `
      <html>
        <body>
          <p>Hello,</p>
          <p>This is a reminder that your task "<strong>${taskTitle}</strong>" is due at <strong>${taskDueTime}</strong>.</p>
          <p>Please make sure to complete it on time.</p>
        </body>
      </html>
    `;
    
    try {
      const emailResponse = await EMAILSENDER.messages.create('your-domain.com', {
        from: 'noreply@your-domain.com',
        to: [email],
        subject: subject,
        html: html,
      });
      console.log('HTML Email sent:', emailResponse);
    } catch (error) {
      console.error('Error sending HTML email:', error);
    }
  };
}

export default EmailService;
