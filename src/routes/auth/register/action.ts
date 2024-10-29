import z from 'zod';
import { type ActionFunctionArgs } from "react-router-dom";

import { useAuthStore } from 'src/stores';
import { register } from "src/utils/services";

const SignupSchema = z.object({
  lastName: z.string(),
  firstName: z.string(),
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
  const lastName = formData.get("lastName")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString();

  const { error, data } = SignupSchema.safeParse({ email, password, firstName, lastName });

  if (error) {
    useAuthStore.setState({ status: false, errors: error.errors,  message: "Invalid data provided." })
    return;
  }

  try {
    const response = await register(data);
    if (response.user) {
      useAuthStore.setState({ status: true, message: response.message })
    return null
    } else {
      useAuthStore.setState({ status: false, message: response.message })
    return null
    }
  } catch (error) {
    console.log(error)
    useAuthStore.setState({ status: false, message: "Something went wrong. Please try again." })
    return null
  }
}
