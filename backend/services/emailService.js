import nodemailer from "nodemailer";

class EmailService {

  static transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  static async sendVerificationEmail(toEmail, token) {

    const verificationLink =
      `${process.env.BASE_URL}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Verify Your Alumni Account",
      html: `
        <h2>Welcome to Alumni Platform</h2>
        <p>Please click below to verify:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    console.log("Verification email sent to:", toEmail);
  }

  static async sendPasswordResetEmail(toEmail, token) {

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `
    });
  }

}



EmailService.transporter.verify((error, success) => {
    if (error) {
      console.log("SMTP ERROR:", error);
    } else {
      console.log("SMTP READY");
    }
  });



export default EmailService;