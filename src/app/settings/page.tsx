import SettingsClient from "./settings-client";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
       <h1 className="font-headline text-3xl font-bold tracking-tight">
        Settings
      </h1>
      <SettingsClient />
    </div>
  );
}
