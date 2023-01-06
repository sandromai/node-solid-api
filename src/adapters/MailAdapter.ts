interface Attachment {
  fileName: string;
  path?: string;
  content?: string;
  encoding?: string;
}

export interface SendMailData {
  from: string;
  to: string;
  subject: string;
  body: string;
  attachments?: Array<Attachment>;
}

export interface MailAdapter {
  sendMail(data: SendMailData): Promise<void>;
}
