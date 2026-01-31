import { LoginForm } from "./components/login-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Login = () => {
  return (
    <section className="wrapper justify-center">
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
