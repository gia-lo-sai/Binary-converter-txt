"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/user-context";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function ProfilePage() {
  const { user, updateUser, isUserLoading } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setAvatar(user.avatarUrl);
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-9 w-40" />
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const handleSaveChanges = () => {
    updateUser({ username, email, avatarUrl: avatar });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarChange = () => {
    fileInputRef.current?.click();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon">
                <Link href="/">
                  <ArrowLeft />
                  <span className="sr-only">Back to Home</span>
                </Link>
              </Button>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                User Profile
              </h1>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    {avatar && (
                      <Image
                        src={avatar}
                        alt={user.username}
                        width={80}
                        height={80}
                        className="object-cover"
                        data-ai-hint="profile avatar"
                      />
                    )}
                    <AvatarFallback className="text-2xl">
                      {user.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button variant="outline" onClick={triggerAvatarChange}>
                    Change Avatar
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
