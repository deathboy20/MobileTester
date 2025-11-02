import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BotMessageSquare,
  CheckCircle,
  UploadCloud,
  Smartphone,
  Zap,
  FileCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center mr-2">
            <span className="text-primary-foreground font-bold text-xs">
              MT
            </span>
          </div>
          <span className="font-headline font-bold">MobileTester</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="w-fit">
                    🚀 Free MVP - Android Testing Platform
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Test Once, Ship Confidently
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Upload your Android APK and let our AI analyze it across 20+
                    devices in parallel. Get comprehensive bug reports with
                    actionable fix suggestions in minutes.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Start Testing for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:order-last">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                  <Card className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
                    <CardHeader>
                      <CardTitle className="text-center font-headline">
                        Mock Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/50 rounded-lg">
                        <span className="text-sm font-medium">MyApp.apk</span>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-white/50 dark:bg-black/50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            18
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Passed
                          </div>
                        </div>
                        <div className="p-2 bg-white/50 dark:bg-black/50 rounded">
                          <div className="text-lg font-bold text-red-600">
                            2
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Failed
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* How it works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge variant="outline">How it Works</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Three Simple Steps
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                From upload to actionable insights in minutes
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-3">
              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Upload APK</h3>
                <p className="text-muted-foreground">
                  Drag and drop your Android APK file and add an optional README
                  for context.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Smartphone className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Parallel Testing</h3>
                <p className="text-muted-foreground">
                  Your app runs simultaneously across 20 popular Android devices
                  using Firebase Test Lab.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BotMessageSquare className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Get intelligent bug detection and actionable fix suggestions
                  powered by Groq AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline">Key Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Professional Android testing platform built for developers who
                  ship with confidence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Parallel testing across multiple devices means results in
                    5-10 minutes, not hours.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BotMessageSquare className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced AI detects crashes, ANRs, performance issues, and
                    provides specific fix suggestions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Smartphone className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>20+ Real Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Test on the most popular Android devices covering different
                    manufacturers and OS versions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Comprehensive Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Download detailed PDF reports with screenshots, videos, and
                    actionable recommendations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 MobileTester. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
