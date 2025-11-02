"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeviceSelector } from "./DeviceSelector";
import { UploadCloud, Loader2 } from "lucide-react";
import { useUser } from "@/firebase";
import { useDeviceSelector } from "@/hooks/useDeviceSelector";
import { validateApkFile } from "@/lib/blob";
import { useRouter } from "next/navigation";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [readme, setReadme] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const { selectedDevices } = useDeviceSelector(5);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validation = validateApkFile(file);
      if (validation.valid) {
        setApkFile(file);
        toast.success("APK file selected successfully!");
      } else {
        toast.error(validation.error || "Invalid file");
        setApkFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user || !apkFile) {
      toast.error("You must be logged in and have an APK file selected.");
      return;
    }

    if (selectedDevices.length === 0) {
      toast.error("Please select at least one device for testing.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("apk", apkFile);
      formData.append("readme", readme);
      formData.append("devices", JSON.stringify(selectedDevices));

      // Upload APK and create job
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await uploadResponse.json();

      // Start testing process
      const testResponse = await fetch("/api/tests/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: result.jobId,
          apkUrl: result.apkUrl,
          devices: selectedDevices,
        }),
      });

      if (!testResponse.ok) {
        const error = await testResponse.json();
        console.warn("Failed to start testing:", error);
        // Don't throw error - job was created successfully
      }

      toast.success("APK uploaded successfully! Testing has started.");

      // Reset state and close dialog
      setOpen(false);
      setStep(1);
      setApkFile(null);
      setReadme("");

      // Navigate to job details or dashboard
      if (result.jobId) {
        router.push(`/jobs/${result.jobId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Upload APK",
      description: "Select or drag and drop your Android APK file.",
      content: (
        <div className="grid gap-2">
          <Label htmlFor="apk-file">APK File</Label>
          <div className="relative flex items-center justify-center w-full">
            <label
              htmlFor="apk-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  {apkFile ? (
                    <span className="font-semibold text-foreground">
                      {apkFile.name}
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  APK files only (MAX. 50MB)
                </p>
              </div>
              <input
                id="apk-file"
                type="file"
                className="hidden"
                accept=".apk"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      ),
      canProceed: !!apkFile,
    },
    {
      title: "Add Details",
      description: "Optionally provide a README for context.",
      content: (
        <div className="grid gap-2">
          <Label htmlFor="readme">README.md</Label>
          <Textarea
            id="readme"
            value={readme}
            onChange={(e) => setReadme(e.target.value)}
            placeholder="Enter any relevant information here in Markdown format..."
            className="min-h-[150px]"
          />
        </div>
      ),
      canProceed: true,
    },
    {
      title: "Select Devices",
      description: "Choose which devices to run your tests on.",
      content: (
        <div className="grid gap-2">
          <Label>Devices</Label>
          <DeviceSelector />
        </div>
      ),
      canProceed: selectedDevices.length > 0,
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" /> Start New Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {currentStep.title}
          </DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {currentStep.content}
        </motion.div>

        <DialogFooter>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {step < steps.length ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!currentStep.canProceed || isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!currentStep.canProceed || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit Job"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
