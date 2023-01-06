import { writeFile } from 'fs';

export function saveLog(
  logFilePath: string,
  message: string
): void {
  let formattedMessage = message;

  formattedMessage.replace(/\r\n|\r/g, '\n');

  if (!formattedMessage.endsWith('\n')) {
    formattedMessage += '\n';
  }

  formattedMessage = `[${new Date().toISOString()}] ${formattedMessage}`;

  writeFile(
    logFilePath,
    formattedMessage,
    () => {}
  );
}
