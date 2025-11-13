'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import Link from 'next/link';

export default function ConverterPage() {
  const [convertedText, setConvertedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, "") + '.txt');
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(arrayBuffer);
        setConvertedText(text);
        toast({
          title: 'File Converted',
          description: 'The .bin file has been converted to readable text.',
        });
      }
    };

    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not read the file.',
        });
    }

    reader.readAsArrayBuffer(file);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleDownload = () => {
    if (!convertedText || !fileName) {
        toast({
            variant: 'destructive',
            title: 'No file to save',
            description: 'Please upload and convert a .bin file first.',
        });
      return;
    }

    const blob = new Blob([convertedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
     toast({
          title: 'File Downloaded',
          description: `Saved as ${fileName}`,
     });
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
                BIN to TXT Converter
              </h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Upload and Convert</CardTitle>
                <CardDescription>
                  Select a `.bin` file from your computer to convert it into a readable text file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="bin-file">.bin File</Label>
                    <Input
                        id="bin-file"
                        type="file"
                        accept=".bin,application/octet-stream"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                     <Button onClick={triggerFileSelect}>
                        <Upload className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                </div>

                {convertedText && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="converted-output">Converted Output (Readable Text)</Label>
                        <Textarea
                        id="converted-output"
                        readOnly
                        value={convertedText}
                        className="h-48 resize-none font-mono"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" /> Save as .txt
                        </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
