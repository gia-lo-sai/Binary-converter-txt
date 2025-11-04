import SettingsClient from "./settings-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";


export default function SettingsPage() {
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
                  <span className="sr-only">Torna alla home</span>
                </Link>
              </Button>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                Settings
              </h1>
            </div>
            <SettingsClient />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
