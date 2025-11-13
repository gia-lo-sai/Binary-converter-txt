# Aether Settings Sync

Developed by **Gia-lo-sai-&-Gemini**.

## Description

**Aether Settings Sync** is a web application that allows users to manage and synchronize their application preferences, such as theme and language, across different sessions. It includes a user authentication system and a utility to convert binary files to text.

## Main Features

- **User Authentication**: Secure login and registration system via Firebase Authentication.
- **Synced Preferences**: User settings (theme, language) are saved to Firestore and synchronized across devices.
- **Profile Management**: Users can update their profile information, including username and avatar.
- **Binary to TXT Converter**: A utility to upload a `.bin` file and convert its content into a readable and downloadable text format.

## Project Structure

The project is a Next.js application with the following structure:

- **`src/app/`**: Contains the main pages of the application (Home, Login, Profile, Settings, Converter).
- **`src/components/`**: Shared React components, including UI elements from ShadCN and the navigation sidebar.
- **`src/context/`**: React context providers, such as `UserProvider` for user state management.
- **`src/firebase/`**: Firebase configuration and custom hooks for interacting with Firestore and Authentication.
- **`src/lib/`**: Utility functions and static data.
- **`public/`**: Static assets.
- **`firestore.rules`**: Security rules for the Firestore database.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Backend & Database**: Firebase (Authentication, Firestore)
- **Styling**: Tailwind CSS, ShadCN UI
- **UI Libraries**: `lucide-react` for icons
