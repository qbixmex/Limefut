import { redirect } from "next/navigation";
import { LoginForm } from "./components/login-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth.config";

export const Login = async () => {
  const session = await auth();

  if(session?.user) {
    redirect('/admin/dashboard');
  }

  return (
    <section className="flex-1 rounded p-5 flex flex-col item-center justify-center">
      <Card className="w-full max-w-md mx-auto p-10">
        <CardHeader>
          <CardTitle className="text-center text-xl">Accede con tus credenciales</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
