// export const authOptions = { };
export class AuthError extends Error {
  constructor(message: string | string[]) {
    super(AuthError.messageToString(message));
  }

  private static messageToString(message: string | string[]) {
    if (typeof message === 'string') {
      return JSON.stringify([message]);
    }
    return JSON.stringify(message);
  }
}
