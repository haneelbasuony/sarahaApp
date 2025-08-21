import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, attachments, link, html }) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    secure: true, // true for 465, false for other ports
    service: 'gmail',
    auth: {
      user: 'hanehatemelbasuony20@gmail.com',
      pass: 'xlrwmbqixsyyentu',
    },
  });

  const info = await transporter.sendMail({
    from: '"Wassabi 😜" <hanehatemelbasuony20@gmail.com>',
    to: to || 'hanehatem72@gmail.com',
    subject: subject || 'Hello SarahaApp User',
    html:
      html ||
      `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
              <td align="center" style="background-color:#28a745; padding:30px;">
                <h1 style="color:#ffffff; margin:0; font-size:28px;">Confirm Your Email ✅</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:30px; text-align:left; color:#333333;">
                <h2 style="margin-top:0;">Hello 👋</h2>
                <p style="font-size:16px; line-height:1.6;">
                  Thanks for signing up for <b>Wassabi</b>! To start using your account, please confirm your email address by clicking the button below.
                </p>
                <div style="text-align:center; margin:30px 0;">
                  <a href="${link}"
                    style="background-color:#28a745; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-weight:bold; font-size:16px; display:inline-block;">
                    ✅ Confirm Email
                  </a>
                </div>
                <p style="font-size:14px; color:#666; line-height:1.5;">
                  This link will expire in <b>3 minutes</b>. If you didn’t create this account, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="background-color:#f4f4f4; padding:20px; font-size:12px; color:#999;">
                © 2025 Wassabi. All rights reserved.<br>
                <a href="https://yourwebsite.com/unsubscribe" style="color:#28a745; text-decoration:none;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
    attachments: attachments || [],
  });

  if (info.accepted.length > 0) {
    return true;
  } else {
    return false;
  }
};
