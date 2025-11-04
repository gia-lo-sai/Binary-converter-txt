"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/user-context";
import { Globe, Palette, Settings, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-2-3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div className="mt-8">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-11 w-32" />
                  <Skeleton className="h-11 w-36" />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please log in to continue.</p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                Welcome, {user?.username.split(" ")[0] || "User"}!
              </h1>
              <p className="text-muted-foreground">
                Here's your personal dashboard for Aether Settings Sync.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Theme Control
                  </CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-headline">
                    Personalized UI
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Switch between light and dark themes anytime.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Language Settings
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-headline">
                    Global Access
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred language for the interface.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Synced Preferences
                  </CardTitle>
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-headline">
                    Always Yours
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your settings are saved and synced across sessions.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <h2 className="font-headline text-2xl font-semibold mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/profile">
                    <User />
                    <span>Go to Profile</span>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/settings">
                    <Settings />
                    <span>Adjust Settings</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
