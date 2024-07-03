import { z } from "zod";

//These Zod types will be reused for both server-side and client-side form validation
export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});
export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;
