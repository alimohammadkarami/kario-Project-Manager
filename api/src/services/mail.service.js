import { config } from '../config/env.js';
import { passwordResetCodeEmail } from '../utils/emailTemplates.js';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

/** Low-level sender: the only code that knows Brevo exists. */
async function sendEmail({ to, subject, html, text }) {
  if (!config.mail.brevoApiKey) {
    // development fallback: print the email instead of sending it
    console.log(`\n[mail:dev] to=${to}\nsubject=${subject}\n${text}\n`);
    return;
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': config.mail.brevoApiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: config.mail.fromEmail, name: config.mail.fromName },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Brevo responded with ${response.status}: ${body}`);
  }
}

export const MailService = {
  sendPasswordResetCode({ to, fullName, code, ttlMinutes }) {
    return sendEmail({ to, ...passwordResetCodeEmail({ fullName, code, ttlMinutes }) });
  },
};
