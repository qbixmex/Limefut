import { isPasswordInsecure } from "@/lib/passwords_check";

describe('Test on Password Check', () => {
  test('Should checks if the provided password is in the list of common passwords.', () => {
    expect(isPasswordInsecure('0123456789')).toBe(true);
    expect(isPasswordInsecure('secretpassword')).toBe(true);
    expect(isPasswordInsecure('password123')).toBe(true);
    expect(isPasswordInsecure('1111')).toBe(true);
    expect(isPasswordInsecure('123123')).toBe(true);
  });
});