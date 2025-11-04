"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { useUser } from "@/context/user-context";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Skeleton } from "@/components/ui/skeleton";

type AppSettings = {
  theme: "light" | "dark" | "system";
  language: string;
};

export default function SettingsClient() {
  const { setTheme: applyTheme } = useTheme();
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [isMounted, setIsMounted] = useState(false);

  const settingsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.id, "settings");
  }, [firestore, user]);

  const { data: settings, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsRef);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme, applyTheme]);

  const handleLanguageChange = (value: string) => {
    if (settingsRef) {
      setDocumentNonBlocking(settingsRef, { language: value }, { merge: true });
    }
  };

  const handleThemeChange = (isDark: boolean) => {
    const newTheme = isDark ? "dark" : "light";
    if (settingsRef) {
      setDocumentNonBlocking(settingsRef, { theme: newTheme }, { merge: true });
    }
    applyTheme(newTheme);
  };
  
  const currentTheme = settings?.theme || 'system';

  if (!isMounted || isUserLoading || areSettingsLoading) {
    return (
       <div className="grid gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
             <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-40" />
             </div>
             <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
             <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
             </div>
             <Skeleton className="h-10 w-[180px]" />
          </div>
        </CardContent>
      </Card>
    </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Display</CardTitle>
          <CardDescription>
            Manage your theme and language preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="theme-switch">Theme</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode.
              </p>
            </div>
            <div className="flex items-center gap-2">
                <Sun className="h-5 w-5"/>
                <Switch
                    id="theme-switch"
                    checked={currentTheme === "dark"}
                    onCheckedChange={handleThemeChange}
                    aria-label="Theme switch"
                />
                <Moon className="h-5 w-5"/>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
             <div className="space-y-0.5">
              <Label htmlFor="language-select">Language</Label>
               <p className="text-sm text-muted-foreground">
                Choose your preferred interface language.
              </p>
            </div>
            <Select onValueChange={handleLanguageChange} value={settings?.language || 'en'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
