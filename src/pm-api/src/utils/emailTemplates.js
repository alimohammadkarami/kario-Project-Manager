const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function passwordResetCodeEmail({ fullName, code, ttlMinutes }) {
  const subject = 'کد بازیابی رمز عبور';

  const text =
    `سلام ${fullName}\n\n` +
    `کد بازیابی رمز عبور شما: ${code}\n` +
    `این کد تا ${ttlMinutes} دقیقه معتبر است.\n\n` +
    'اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.';

  const html = `
<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#222">
  <h2 style="margin-top:0">بازیابی رمز عبور</h2>
  <p>سلام ${escapeHtml(fullName)}،</p>
  <p>کد تأیید شما:</p>
  <p style="font-size:32px;letter-spacing:8px;font-weight:bold;text-align:center;background:#f4f4f5;border-radius:8px;padding:16px;direction:ltr">${escapeHtml(code)}</p>
  <p>این کد تا ${escapeHtml(ttlMinutes)} دقیقه معتبر است.</p>
  <p style="color:#777;font-size:13px">اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
</div>`.trim();

  return { subject, html, text };
}
