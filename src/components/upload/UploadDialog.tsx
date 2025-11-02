"use client"

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
import { UploadCloud } from "lucide-react";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [apkFile, setApkFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith(".apk") && file.size < 50 * 1024 * 1024) {
        setApkFile(file);
      } else {
        toast.error("Invalid file. Please upload a .apk file under 50MB.");
      }
    }
  };
  
  const handleSubmit = () => {
    // In a real app, this would trigger the Firebase upload and Firestore doc creation.
    toast.success("Job submitted! Your tests are now in the queue.");
    // Reset state and close dialog
    setOpen(false);
    setStep(1);
    setApkFile(null);
  }

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
                    <span className="font-semibold text-foreground">{apkFile.name}</span>
                  ) : (
                    <>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">APK files only (MAX. 50MB)</p>
              </div>
              <input id="apk-file" type="file" className="hidden" accept=".apk" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      ),
      canProceed: !!apkFile
    },
    {
      title: "Add Details",
      description: "Optionally provide a README for context.",
      content: (
        <div className="grid gap-2">
          <Label htmlFor="readme">README.md</Label>
          <Textarea id="readme" placeholder="Enter any relevant information here in Markdown format..." className="min-h-[150px]" />
        </div>
      ),
      canProceed: true
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
      canProceed: true // DeviceSelector manages its own state
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
          <DialogTitle className="font-headline">{currentStep.title}</DialogTitle>
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
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < steps.length ? (
            <Button onClick={() => setStep(step + 1)} disabled={!currentStep.canProceed}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Job</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
