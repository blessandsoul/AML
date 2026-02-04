import { LoginForm } from '@/features/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'შესვლა | AML',
  description: 'შედით თქვენს AML ანგარიშზე',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">შესვლა</CardTitle>
          <CardDescription>
            შეიყვანეთ თქვენი მონაცემები ანგარიშზე შესასვლელად
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
