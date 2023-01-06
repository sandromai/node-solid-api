export function checkUsername(username: string): boolean {
  return (
    /^[a-z0-9_\.]+$/gi.test(username) &&
    !/(_\.)|(\._)|(\.\.)|(__)/g.test(username)
  );
}
