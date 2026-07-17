import z from 'zod';

/**
 * Creates a Zod schema that validates a required UUID string.
 *
 * @param requiredMessage The message to display if the UUID is not provided
 * @param invalidMessage The message to display if the UUID is invalid
 * @returns A Zod schema that validates a required UUID
 */
export const requiredUUID = (requiredMessage: string, invalidMessage: string) =>
  z.string().superRefine((value, context) => {
    if (!value) {
      context.addIssue({ code: 'custom', message: requiredMessage });
      return;
    }
    if (!z.uuid().safeParse(value).success) {
      context.addIssue({ code: 'custom', message: invalidMessage });
    }
  });

/**
 * Get terminal ANSI COLOR
 * @param color The terminal color
 * @returns The ANSI color for node
 */
export const getTerminalColor = (color: 'red' | 'green' | 'yellow' | 'blue' | 'reset'): string => {
  switch (color) {
    case 'red':
      return '\x1b[31m';
    case 'green':
      return '\x1b[32m';
    case 'yellow':
      return '\x1b[33m';
    case 'blue':
      return '\x1b[34m';
    default:
      return '\x1b[0m';
  }
};
