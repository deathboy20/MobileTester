"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth, useFirestore, useUser } from "@/firebase";
import {
  initiateEmailSignUp,
} from "@/firebase/non-blocking-login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306 14.691c2.242-4.333 6.64-7.237 11.739-7.857l-5.657 5.657c-1.554 1.554-2.81 3.42-3.642 5.488z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.521-4.51 2.43-7.219 2.43c-5.225 0-9.726-3.363-11.303-8H4.389c1.649 4.657 6.08 8 11.303 8L24 44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l6.19 5.238C42.022 35.244 44 30.027 44 24c0-1.341-.138-2.65-.389-3.917z"
      ></path>
    </svg>
  );
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
       if (user && firestore) {
        const userRef = doc(firestore, "users", user.uid);
        setDocumentNonBlocking(userRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
      toast.success("Signed in with Google successfully!");
    } catch (error: any) {
      toast.error("Google Sign-In Failed", {
        description: error.message,
      });
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await initiateEmailSignUp(
        auth,
        values.email,
        values.password
      );

      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: values.name });
        
        if (firestore) {
            const userRef = doc(firestore, "users", user.uid);
            setDocumentNonBlocking(userRef, {
                id: user.uid,
                name: values.name,
                email: values.email,
                createdAt: new Date().toISOString(),
            }, { merge: true });
        }

        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      toast.error("Registration Failed", {
        description: error.message,
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">
          Create an Account
        </CardTitle>
        <CardDescription>
          Get started with AI-powered mobile testing.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex Tester" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tester@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Sign up with Google
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
