export const resetPasswordMessage = (link: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <h2 style="color: #2c3e50; text-align: center;">🔐 Password Reset Request</h2>
      
      <p>Hello,</p>
      <p>You have requested to reset your password. Please click the button below to create a new one:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}"
           style="background-color: #4CAF50;
                  color: #fff;
                  padding: 14px 24px;
                  font-size: 16px;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 6px;
                  display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p style="margin-bottom: 30px;">⚠️ Note: This link will expire in <strong>1 hour</strong>.</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="color: #666; font-size: 13px;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>
      <p style="color: #0066cc; font-size: 13px; word-break: break-all;">
        <a href="${link}" style="color: #0066cc;">${link}</a>
      </p>
      
      <p style="margin-top: 40px;">Best regards,<br><strong>Your Support Team</strong></p>
    </div>
  `;
};
