import nodemailer from 'nodemailer';

import { MailAdapter, SendMailData } from '../MailAdapter';

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({
    from,
    to,
    subject,
    body,
    attachments
  }: SendMailData) {
    await transport.sendMail({
      from,
      to,
      subject,
      html: body,
      attachments
    });
  };
}