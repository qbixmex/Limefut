import { getTerminalColor, requiredUUID } from '@/lib/helpers';

describe('Test on Helpers', () => {
  test('Should validates zod Schema', () => {
    const schema = requiredUUID('¡ El id es requerido !', 'El id debe ser un UUID válido');

    expect(schema.safeParse('01aa10d4-aeab-4fe5-b5c3-dd46d1ac58fb').success).toBe(true);

    const emptyResult = schema.safeParse('');
    expect(emptyResult.success).toBe(false);
    expect(emptyResult.error?.issues[0].message).toBe('¡ El id es requerido !');

    const invalidResult = schema.safeParse('invalid-uuid');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error?.issues[0].message).toBe('El id debe ser un UUID válido');
  });

  describe('Tests on getTeminalColor', () => {
    test('Should returns red ansi color', () => {
      expect(getTerminalColor('red')).toBe('\x1b[31m');
    });

    test('Should returns green ansi color', () => {
      expect(getTerminalColor('green')).toBe('\x1b[32m');
    });

    test('Should returns yellow ansi color', () => {
      expect(getTerminalColor('yellow')).toBe('\x1b[33m');
    });

    test('Should returns yellow ansi color', () => {
      expect(getTerminalColor('yellow')).toBe('\x1b[33m');
    });

    test('Should returns blue ansi color', () => {
      expect(getTerminalColor('blue')).toBe('\x1b[34m');
    });

    test('Should returns reset ansi color', () => {
      expect(getTerminalColor('reset')).toBe('\x1b[0m');
    });
  });
});
