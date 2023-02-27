import { hashPassword, verifyPassword } from '@/lib/server.utils';

describe('Password hashing', () => {
  it('should return a hashed password', async () => {
    const password = 'myPassword123';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it('should return true when the password is correct', async () => {
    // Arrange
    const password = 'user typed password123';
    const hashedPassword = await hashPassword(password);
    // Act
    const isCorrect = await verifyPassword(password, hashedPassword);
    // Assert
    expect(isCorrect).toBe(true);
  });

  it('should return false when the password is incorrect', async () => {
    // Arrange
    const password = 'user typed password123';
    const wrongPassword = 'wrong password';
    const hashedPassword = await hashPassword(password);
    // Act
    const isCorrect = await verifyPassword(wrongPassword, hashedPassword);
    // Assert
    expect(isCorrect).toBe(false);
  });
});
