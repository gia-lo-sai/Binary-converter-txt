# Aether Settings Sync

Sviluppata da **Gia-lo-sai-&-Gemini**.

## Descrizione

**Aether Settings Sync** è un'applicazione web che consente agli utenti di gestire e sincronizzare le preferenze della loro applicazione, come il tema e la lingua, attraverso diverse sessioni. Include un sistema di autenticazione utente e un'utility per convertire file binari in testo.

## Funzionalità Principali

- **Autenticazione Utente**: Sistema di login e registrazione sicuro tramite Firebase Authentication.
- **Preferenze Sincronizzate**: Le impostazioni utente (tema, lingua) vengono salvate su Firestore e sincronizzate tra i dispositivi.
- **Gestione Profilo**: Gli utenti possono aggiornare le informazioni del proprio profilo, inclusi username e avatar.
- **Convertitore da Binario a TXT**: Un'utility per caricare un file `.bin` e convertirne il contenuto in un formato di testo leggibile e scaricabile.

## Struttura del Progetto

Il progetto è un'applicazione Next.js con la seguente struttura:

- **`src/app/`**: Contiene le pagine principali dell'applicazione (Home, Login, Profilo, Impostazioni, Convertitore).
- **`src/components/`**: Componenti React condivisi, inclusi elementi UI di ShadCN e la sidebar di navigazione.
- **`src/context/`**: Provider di contesto React, come `UserProvider` per la gestione dello stato dell'utente.
- **`src/firebase/`**: Configurazione di Firebase e hook personalizzati per interagire con Firestore e Authentication.
- **`src/lib/`**: Funzioni di utilità e dati statici.
- **`public/`**: Asset statici.
- **`firestore.rules`**: Regole di sicurezza per il database Firestore.

## Tecnologie Utilizzate

- **Frontend**: Next.js, React, TypeScript
- **Backend & Database**: Firebase (Authentication, Firestore)
- **Styling**: Tailwind CSS, ShadCN UI
- **Librerie UI**: `lucide-react` per le icone