import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Github, Heart } from "lucide-react";
import Link from "next/link";

const techStack = [
  { name: "Next.js 15", description: "React framework with App Router" },
  { name: "TypeScript", description: "Type-safe JavaScript" },
  { name: "Tailwind CSS", description: "Utility-first CSS framework" },
  { name: "ShadCN UI", description: "Beautiful component library" },
  { name: "Firebase", description: "Auth, Firestore, Storage" },
  { name: "Vercel Blob", description: "File storage for APKs" },
  { name: "Firebase Test Lab", description: "Device testing service" },
  { name: "Groq AI", description: "Fast AI inference for analysis" },
  { name: "PDF Generation", description: "Automated report creation" },
];

const roadmap = [
  {
    version: "v1.0 - MVP",
    status: "current",
    features: [
      "Android APK testing on 20+ devices",
      "AI-powered bug analysis with Groq",
      "PDF report generation",
      "Real-time test status updates",
      "Free tier for developers",
    ],
  },
  {
    version: "v1.1 - Enhanced Testing",
    status: "planned",
    features: [
      "iOS app testing support",
      "Custom device selection",
      "Performance benchmarking",
      "Team collaboration features",
      "API access for CI/CD integration",
    ],
  },
  {
    version: "v2.0 - SaaS Platform",
    status: "future",
    features: [
      "Multi-tenant dashboard",
      "Advanced analytics & insights",
      "White-label solutions",
      "Enterprise security features",
      "Custom pricing tiers",
    ],
  },
];

const faqs = [
  {
    question: "Is MobileTester really free?",
    answer: "Yes! Our MVP is completely free for developers. We leverage free tiers of Firebase, Vercel, and Groq to keep costs at zero for low-volume usage. As we scale, we'll introduce optional premium features while keeping core testing free.",
  },
  {
    question: "How many devices can I test on?",
    answer: "Currently, you can test on our curated list of 20 popular Android devices, covering different manufacturers, Android versions, and screen sizes. This ensures comprehensive compatibility testing.",
  },
  {
    question: "What kind of bugs does the AI detect?",
    answer: "Our AI analyzes test logs to identify crashes, ANRs (Application Not Responding), UI issues, performance problems, and compatibility issues. It provides actionable fix suggestions based on your app's README and common Android development patterns.",
  },
  {
    question: "How long does testing take?",
    answer: "Tests run in parallel across all selected devices, typically completing within 5-10 minutes depending on your app's complexity and the number of devices selected.",
  },
  {
    question: "Can I download the test reports?",
    answer: "Yes! You get comprehensive PDF reports with test summaries, device-specific results, screenshots, videos, and AI-generated bug fix suggestions.",
  },
  {
    question: "When will iOS support be available?",
    answer: "iOS testing is planned for v1.1, expected in Q2 2024. We're focusing on perfecting the Android experience first before expanding to iOS.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">MT</span>
          </div>
          <span className="ml-2 font-headline font-bold">MobileTester</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
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

      <main className="flex-1 container px-4 py-12 mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl font-headline mb-4">
            About MobileTester
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An AI-powered Android testing platform that helps developers ship with confidence.
            Test once across 20+ devices, get actionable insights, and fix bugs faster.
          </p>
        </div>

        {/* MVP Overview */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-4">MVP Overview</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our Minimum Viable Product focuses on delivering core value: automated Android testing
              with AI-powered analysis, completely free for developers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Easy Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply upload your APK and optional README. Our system handles the rest automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Parallel Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Test simultaneously across 20 popular Android devices using Firebase Test Lab.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get intelligent bug detection and actionable fix suggestions powered by Groq AI.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-4">Tech Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern, scalable technologies that leverage free tiers to keep costs minimal.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <Card key={tech.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-4">Roadmap</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our journey from MVP to full-scale SaaS platform.
            </p>
          </div>

          <div className="space-y-6">
            {roadmap.map((phase) => (
              <Card key={phase.version}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-headline">{phase.version}</CardTitle>
                    <Badge
                      variant={phase.status === 'current' ? 'default' : 'outline'}
                    >
                      {phase.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Built with Love in Ghana
              </CardTitle>
              <CardDescription>
                Crafted by passionate developers who understand the pain of mobile app testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about MobileTester
            </p>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
