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

export default function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem("app-language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("app-language", value);
  };

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  if (!isMounted) {
    return null; // or a loading skeleton
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
                    checked={theme === "dark"}
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
            <Select onValueChange={handleLanguageChange} value={language}>
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
