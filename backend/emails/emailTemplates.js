export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Chatty</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f6f8; color:#333;">
    
    <!-- Container -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#5B86E5; padding:30px;">
                <h1 style="color:#fff; margin:0; font-size:26px; font-weight:600;">Welcome to Chatty 🎉</h1>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 30px;">
                <p style="font-size:16px; margin:0 0 20px;">Hi <strong>${name}</strong>,</p>
                <p style="font-size:16px; margin:0 0 20px;">
                  We’re thrilled to have you join <strong>Chatty</strong> — your new place to connect and chat with friends, family, and colleagues.
                </p>
                
                <!-- Callout -->
                <div style="background:#f9fafc; border-left:4px solid #5B86E5; padding:15px 20px; margin:25px 0; border-radius:6px;">
                  <p style="margin:0; font-size:15px;">
                    ✅ Set up your profile <br/>
                    ✅ Add your contacts <br/>
                    ✅ Start chatting instantly
                  </p>
                </div>
                
                <!-- Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${clientURL}" style="background:#5B86E5; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:6px; font-size:16px; font-weight:600; display:inline-block;">
                    Get Started
                  </a>
                </div>
                
                <p style="font-size:15px; margin:0 0 10px;">
                  If you ever need help, just hit reply — we’re here for you 💙
                </p>
                <p style="font-size:15px; margin:0;">Happy chatting,<br/>The Chatty Team</p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td align="center" style="padding:20px; font-size:12px; color:#777; background:#f4f6f8;">
                <p style="margin:0;">© 2025 Chatty Inc. All rights reserved.</p>
                <p style="margin:8px 0 0;">
                  <a href="#" style="color:#5B86E5; text-decoration:none; margin:0 8px;">Privacy</a> | 
                  <a href="#" style="color:#5B86E5; text-decoration:none; margin:0 8px;">Terms</a> | 
                  <a href="#" style="color:#5B86E5; text-decoration:none; margin:0 8px;">Support</a>
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}
