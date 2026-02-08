import { headers } from "next/headers";
import { LoginForm } from "./components/login-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const Login = () => {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
};

const LoginContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <section className="wrapper justify-center">
      <Card className="w-full max-w-md mx-auto p-10">
        <CardHeader>
          <CardTitle className="text-center text-xl">Accede con tus credenciales</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
