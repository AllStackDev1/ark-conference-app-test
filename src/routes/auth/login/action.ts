import z from 'zod';
import { redirect, type ActionFunctionArgs } from "react-router-dom";

import { useAuthStore } from "src/stores";
import { login } from "src/utils/services";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      ),
    ),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const { error, data } = LoginSchema.safeParse({ email, password });

  if (error) {
    useAuthStore.setState({ status: false, errors: error.errors,  message: "Invalid data provided." })
    return;
  }

  useAuthStore.setState({ isSubmitting: true })

  try {
    const response = await login(data);
    if (response.accessToken) {
      useAuthStore.setState({ user: response.user, accessToken: response.accessToken })
      return redirect("/home");
    } else {
      useAuthStore.setState({ status: false, message: response.message })
      return null;
    }
  } catch (error) {
    console.log(error)
    useAuthStore.setState({ status: false, message: "Something went wrong. Please try again." })
    return null;
  } finally {
    useAuthStore.setState({ isSubmitting: false })
  }
}
