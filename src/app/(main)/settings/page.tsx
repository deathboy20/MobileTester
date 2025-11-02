'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Gem } from "lucide-react"
import { useUser } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";


export default function SettingsPage() {
  const { user } = useUser();
  const [name, setName] = useState(user?.displayName || '');

  const handleSaveChanges = async () => {
    if (user && name !== user.displayName) {
      try {
        await updateProfile(user, { displayName: name });
        toast.success("Profile updated successfully!");
      } catch (error: any) {
        toast.error("Failed to update profile", { description: error.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings.
        </p>
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled />
            </div>
            <div className="space-y-4">
              <Alert>
                <Gem className="h-4 w-4" />
                <AlertTitle>You are on the Free Tier!</AlertTitle>
                <AlertDescription>
                  Your plan includes unlimited authentication and up to 10 Firebase Test Lab runs per day.
                </AlertDescription>
              </Alert>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
