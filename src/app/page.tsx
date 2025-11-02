import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, BotMessageSquare, CheckCircle, UploadCloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroImage = PlaceHolderImages.find(img => img.id === 'device-screenshot-1')!;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="sr-only">MobileTester</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Test Your Android Apps with AI Power
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Upload your APK, select devices, and let our AI-driven
                    platform handle the testing. Get comprehensive reports and
                    bug fix suggestions in minutes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Start Testing for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src={heroImage.imageUrl}
                width="550"
                height="550"
                alt="Hero"
                data-ai-hint={heroImage.imageHint}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Streamline Your QA Process
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  MobileTester provides everything you need to automate your
                  Android testing workflow, from upload to report.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <UploadCloud className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Easy APK Upload</h3>
                <p className="text-muted-foreground">
                  Simply drag and drop your APK file to start a new test run.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <BotMessageSquare className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes test logs to provide a clear summary and
                  actionable bug fix suggestions.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <CheckCircle className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Comprehensive Reports</h3>
                <p className="text-muted-foreground">
                  Get detailed reports for each test run, including screenshots and device-specific results.
                </p>
              </div>
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
