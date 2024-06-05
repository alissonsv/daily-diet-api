import argon2 from 'argon2';

export class PasswordHash {
  static async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2i,
    });
  }

  static async verify(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }
}
