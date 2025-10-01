import { LoginForm } from "@/components/login-form";
export default function Login() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="text-3xl font-bold text-center mb-4">
          STL Athlete Management System
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
