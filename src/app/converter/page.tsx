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

    if (!file.name.endsWith('.bin')) {
        toast({
            variant: 'destructive',
            title: 'File non valido',
            description: 'Per favore, seleziona un file con estensione .bin',
        });
        setConvertedText(null);
        setFileName('');
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        return;
    }

    setFileName(file.name.replace('.bin', '.txt'));
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        const text = Array.from(bytes)
          .map((byte) => byte.toString())
          .join(' ');
        setConvertedText(text);
        toast({
          title: 'File convertito',
          description: 'Il file .bin è stato convertito con successo.',
        });
      }
    };

    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Errore',
            description: 'Impossibile leggere il file.',
        });
    }

    reader.readAsArrayBuffer(file);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleDownload = () => {
    if (!convertedText || !fileName) {
        toast({
            variant: 'destructive',
            title: 'Nessun file da salvare',
            description: 'Per favore, carica e converti prima un file .bin',
        });
      return;
    }

    const blob = new Blob([convertedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
     toast({
          title: 'File scaricato',
          description: `Salvato come ${fileName}`,
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
                  <span className="sr-only">Torna alla home</span>
                </Link>
              </Button>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                Convertitore da BIN a TXT
              </h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Carica e Converti</CardTitle>
                <CardDescription>
                  Seleziona un file `.bin` dal tuo computer per convertirlo in un file di testo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="bin-file">File .bin</Label>
                    <Input
                        id="bin-file"
                        type="file"
                        accept=".bin"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                     <Button onClick={triggerFileSelect}>
                        <Upload className="mr-2 h-4 w-4" /> Carica File .bin
                    </Button>
                </div>

                {convertedText && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="converted-output">Output Convertito (TXT)</Label>
                        <Textarea
                        id="converted-output"
                        readOnly
                        value={convertedText}
                        className="h-48 resize-none font-mono"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" /> Salva come .txt
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
