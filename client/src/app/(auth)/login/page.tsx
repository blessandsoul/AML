import { Suspense } from 'react';
import { LoginForm } from '@/features/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'შესვლა | AML',
  description: 'შედით თქვენს AML ანგარიშზე',
};

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-3.25rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">შესვლა</CardTitle>
          <CardDescription>
            შეიყვანეთ თქვენი მონაცემები ანგარიშზე შესასვლელად
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
