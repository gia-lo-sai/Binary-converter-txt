'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
  initiateAnonymousSignIn,
} from '@/firebase/non-blocking-login';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const { auth } = useFirebase();
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleError = (error: FirebaseError) => {
    let title = 'An error occurred';
    let description = 'Please try again later.';

    switch (error.code) {
      case 'auth/invalid-email':
        title = 'Invalid Email';
        description = 'Please enter a valid email address.';
        break;
      case 'auth/user-not-found':
        title = 'User Not Found';
        description = 'No account found with this email. Please sign up.';
        break;
      case 'auth/wrong-password':
        title = 'Incorrect Password';
        description = 'The password you entered is incorrect. Please try again.';
        break;
      case 'auth/email-already-in-use':
        title = 'Email Already in Use';
        description = 'An account with this email already exists. Please sign in.';
        break;
      case 'auth/weak-password':
        title = 'Weak Password';
        description = 'The password must be at least 6 characters long.';
        break;
      default:
        description = error.message;
        break;
    }

    toast({
      variant: 'destructive',
      title: title,
      description: description,
    });
  };

  const handleSignUp = () => {
    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Please enter both email and password.',
        });
        return;
    }
    initiateEmailSignUp(auth, email, password, undefined, handleError);
  };

  const handleSignIn = () => {
     if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Please enter both email and password.',
        });
        return;
    }
    initiateEmailSignIn(auth, email, password, undefined, handleError);
  };

  const handleAnonymousSignIn = () => {
    initiateAnonymousSignIn(auth);
  };

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSignIn} className="flex-1">
              Sign In
            </Button>
            <Button onClick={handleSignUp} variant="secondary" className="flex-1">
              Sign Up
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAnonymousSignIn}
          >
            Sign in Anonymously
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
