import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class Email {
  constructor(private emailOptions: EmailOptions) {}

  private createTransporter() {
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USERNAME ||
      !process.env.EMAIL_PASSWORD
    ) {
      throw new Error("Please define envs");
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(): Promise<void> {
    await this.createTransporter().sendMail({
      from: "connectix@gmail.com",
      to: this.emailOptions.to,
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: this.emailOptions.html,
    });
  }
}
