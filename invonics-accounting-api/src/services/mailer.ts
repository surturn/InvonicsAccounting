import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  attachments?: Array<{ filename: string; content: string | Buffer }>
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@invonics.com',
      to,
      subject,
      text,
      attachments,
    });
    console.log(`[${new Date().toISOString()}] Email sent successfully to ${to}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Failed to send email to ${to}:`, err);
  }
}
