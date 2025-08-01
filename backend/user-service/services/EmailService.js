// services/EmailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configure based on your email provider
    // This example uses Gmail - you'll need to set up environment variables
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password (not regular password)
      }
    });

    // Alternative configuration for other providers:
    /*
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    */
  }

  async sendEmailVerification(email, username, token) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://frontend:8080'}/dashboard?token=${token}`;
    console.log("**************************************");
    console.log(verificationUrl);
    console.log("**************************************");
    
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - Transcendence Pong',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${username}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for joining Transcendence Pong! To complete your registration and secure your account, 
              please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px; margin: 0;">
                <strong>Why verify your email?</strong><br>
                • Enable two-factor authentication for enhanced security<br>
                • Receive important account notifications<br>
                • Ensure you can recover your account if needed
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              This verification link will expire in 24 hours.<br>
              If you didn't create this account, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async send2FACode(email, username, code) {
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Login Verification Code - Transcendence Pong',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #16a34a;">
            <h2 style="color: #1e293b; margin-top: 0;">Login Verification</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Hello ${username}, someone is trying to log in to your account. 
              If this was you, please use the verification code below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: white; border: 2px solid #16a34a; border-radius: 8px; 
                          display: inline-block; padding: 20px; font-size: 32px; font-weight: bold; 
                          color: #16a34a; letter-spacing: 8px; font-family: monospace;">
                ${code}
              </div>
            </div>
            
            <p style="color: #dc2626; font-size: 14px; background: #fef2f2; padding: 15px; 
                      border-radius: 6px; border-left: 4px solid #dc2626;">
              <strong>Security Notice:</strong> If you didn't try to log in, someone may have your password. 
              Please change your password immediately and check your account security.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              This code will expire in 10 minutes.<br>
              Never share this code with anyone.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 2FA code sent to ${email}`);
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      throw error;
    }
  }

  async send2FAEnabledNotification(email, username, backupCodes) {
    const backupCodesHtml = backupCodes.map(code => 
      `<code style="background: #f1f5f9; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${code}</code>`
    ).join(' ');

    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '2FA Enabled - Your Backup Codes - Transcendence Pong',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #16a34a;">
            <h2 style="color: #1e293b; margin-top: 0;">🔒 Two-Factor Authentication Enabled</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Great news, ${username}! Two-factor authentication has been successfully enabled on your account. 
              Your account is now more secure.
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">⚠️ Important: Save Your Backup Codes</h3>
              <p style="color: #92400e; margin-bottom: 15px;">
                Please save these backup codes in a secure location. You can use them to access your account 
                if you can't receive email verification codes:
              </p>
              <div style="background: white; padding: 15px; border-radius: 4px; text-align: center;">
                ${backupCodesHtml}
              </div>
              <p style="color: #92400e; font-size: 14px; margin-bottom: 0;">
                Each backup code can only be used once. Store them safely!
              </p>
            </div>
            
            <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 6px; padding: 15px;">
              <h4 style="color: #166534; margin-top: 0;">What happens next?</h4>
              <ul style="color: #166534; margin: 0;">
                <li>When you log in, we'll send a verification code to this email</li>
                <li>Enter the code to complete your login</li>
                <li>You can disable 2FA anytime in your account settings</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              If you didn't enable 2FA, please contact support immediately.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 2FA enabled notification sent to ${email}`);
    } catch (error) {
      console.error('Error sending 2FA enabled notification:', error);
      throw error;
    }
  }

  async send2FADisabledNotification(email, username) {
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '2FA Disabled - Transcendence Pong',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h2 style="color: #1e293b; margin-top: 0;">🔓 Two-Factor Authentication Disabled</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Hello ${username}, two-factor authentication has been disabled on your account.
            </p>
            
            <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #dc2626; margin: 0;">
                <strong>Security Notice:</strong> Your account is now less secure. We recommend keeping 2FA enabled 
                for better protection. You can re-enable it anytime in your account settings.
              </p>
            </div>
            
            <p style="color: #475569; font-size: 14px;">
              If you didn't disable 2FA, please secure your account immediately and contact support.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              Stay safe and keep your account secure!
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 2FA disabled notification sent to ${email}`);
    } catch (error) {
      console.error('Error sending 2FA disabled notification:', error);
      throw error;
    }
  }

  async resendVerificationEmail(email, username, token) {
    // Reuse the same template as initial verification
    return this.sendEmailVerification(email, username, token);
  }

  async sendPasswordResetEmail(email, username, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Transcendence Pong',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #f59e0b;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Hello ${username}, we received a request to reset your password. 
              If you made this request, click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 6px; padding: 15px; margin-top: 20px;">
              <p style="color: #dc2626; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't request this password reset, 
                please ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              This password reset link will expire in 1 hour.<br>
              For security reasons, we recommend changing your password regularly.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendPasswordChangedNotification(email, username) {
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully - Transcendence Pong',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #16a34a;">
            <h2 style="color: #1e293b; margin-top: 0;">✅ Password Changed Successfully</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Hello ${username}, your password has been successfully changed.
            </p>
            
            <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #166534; margin: 0;">
                <strong>Security Tip:</strong> Keep your password secure and don't share it with anyone. 
                Consider enabling two-factor authentication for extra security.
              </p>
            </div>
            
            <p style="color: #475569; font-size: 14px;">
              If you didn't change your password, please contact support immediately and secure your account.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              Stay safe and keep your account secure!
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Password changed notification sent to ${email}`);
    } catch (error) {
      console.error('Error sending password changed notification:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, username) {
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Transcendence Pong! 🏓',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #16a34a;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome to the Game, ${username}! 🎉</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Congratulations on successfully verifying your email! You're now ready to experience 
              the ultimate pong gaming platform.
            </p>
            
            <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #166534; margin-top: 0;">🚀 What's Next?</h3>
              <ul style="color: #166534; margin: 0; padding-left: 20px;">
                <li>Complete your profile setup</li>
                <li>Enable two-factor authentication for security</li>
                <li>Add friends and challenge them to matches</li>
                <li>Start playing and climb the leaderboard!</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; font-weight: bold; display: inline-block;">
                Start Playing Now!
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              Ready to become a pong champion? Let the games begin! 🏆
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email service configuration error:', error);
      return false;
    }
  }

  // Send a test email
  async sendTestEmail(email) {
    const mailOptions = {
      from: `"Transcendence Pong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Test Email - Transcendence Pong Email Service',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🏓 Transcendence Pong</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e293b; margin-top: 0;">✅ Email Service Test</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Congratulations! Your email service is working perfectly. This test email confirms that 
              your Transcendence Pong authentication service can send emails successfully.
            </p>
            
            <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #166534; margin: 0;">
                <strong>✅ Email Configuration Status: SUCCESS</strong><br>
                Your email service is ready to send verification emails, 2FA codes, and notifications.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              Test completed at ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Test email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;