import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // send to yourself
      replyTo: email,
      subject: subject
        ? `[Portfolio] ${subject}`
        : `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d16; color: #e2e8f0; padding: 32px; border-radius: 12px; border: 1px solid rgba(197,255,124,0.15);">
          <h2 style="color: #c5ff7c; margin: 0 0 24px; font-size: 20px; font-weight: 600;">
            ✉️ New Portfolio Enquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 13px; width: 80px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 13px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <a href="mailto:${email}" style="color: #c5ff7c; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 13px;">Subject</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${subject}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px;">Message</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
          </div>
          <p style="margin: 32px 0 0; font-size: 12px; color: #4a5568; text-align: center;">
            Sent from your portfolio at neerajsurnis.dev
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
