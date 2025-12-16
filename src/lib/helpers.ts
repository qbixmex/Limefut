import z from "zod";

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
    context.addIssue({ code: "custom", message: requiredMessage });
    return;
  }
  if (!z.uuid().safeParse(value).success) {
    context.addIssue({ code: "custom", message: invalidMessage });
  }
});
