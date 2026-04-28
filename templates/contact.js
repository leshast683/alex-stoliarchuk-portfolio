export function contactEmailTemplate({ name, company, email, phone, service, message }) {
  const field = (label, value) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #999; margin-bottom: 4px;">${label}</span>
        <span style="font-size: 15px; color: #111;">${value || 'N/A'}</span>
      </td>
    </tr>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background: #111; padding: 28px 32px;">
                  <p style="margin: 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.08em;">New Message</p>
                  <h1 style="margin: 6px 0 0; font-size: 22px; color: #ffffff; font-weight: 600;">Contact Form Submission</h1>
                </td>
              </tr>

              <!-- Fields -->
              <tr>
                <td style="padding: 8px 32px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${field('Name', name)}
                    ${field('Email', email)}
                    ${field('Company', company)}
                    ${field('Phone', phone)}
                    ${field('Service', service)}
                  </table>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 0 32px 32px;">
                  <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #999;">Message</p>
                  <div style="background: #f9f9f9; border-left: 3px solid #111; border-radius: 4px; padding: 16px 20px; font-size: 15px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="border-top: 1px solid #eee; padding: 16px 32px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #bbb;">Sent from <a href="https://alexbuildsweb.com" style="color: #888; text-decoration: none;">alexbuildsweb.com</a></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
}
