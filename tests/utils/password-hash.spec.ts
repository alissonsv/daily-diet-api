import { describe, it, expect } from 'vitest';
import { PasswordHash } from '../../src/utils/password-hash';

describe('PasswordHash', () => {
  it('Should hash a password successfully', async () => {
    const sut = PasswordHash;

    await expect(sut.hash('test123')).resolves.not.toEqual('test123');
  });

  it('Should verify if a password is valid', async () => {
    const sut = PasswordHash;
    const originalPassword = 'test123';
    const hashedPassword = await sut.hash(originalPassword);

    await expect(sut.verify(hashedPassword, originalPassword)).resolves.toEqual(
      true,
    );
  });
});
