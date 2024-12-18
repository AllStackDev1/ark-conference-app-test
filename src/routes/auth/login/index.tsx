import { Link, Form } from "react-router-dom";
import { Button } from "src/components";
import { useAuthStore } from "src/stores";

export const Login = () => {
  document.title = "Login";

  const { isSubmitting } = useAuthStore((s) => s);

  return (
    <>
      <Form className="mb-4" method="post">
        <div className="mb-4 md:w-full">
          <label htmlFor="email" className="block text-xs mb-1">
            Email
          </label>
          <input
            className="w-full border rounded p-2 outline-none focus:shadow-outline"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-6 md:w-full">
          <label htmlFor="password" className="block text-xs mb-1">
            Password
          </label>
          <input
            className="w-full border rounded p-2 outline-none focus:shadow-outline"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <Button type="submit" isLoading={isSubmitting}>Login</Button>
      </Form>
      <div className="border-t pt-4 text-center">
        <span className="mr-1">Don't have an account?</span>
        <Link className="text-blue-700 text-center text-sm" to="/register">
          Register
        </Link>
      </div>
      <div className="border-t pt-4 text-center">
        <Link
          className="text-blue-700 text-center text-sm"
          to="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
    </>
  );
};
