"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  name: string;
  email: string;
  avatarUrl: string;
};

type UserContextType = {
  user: User | null;
  logout: () => void;
  updateUser: (newDetails: Partial<User>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockUser: User = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: PlaceHolderImages.find(img => img.id === 'user-avatar')?.imageUrl || '',
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const { toast } = useToast();

  const logout = () => {
    // In a real app, you'd call Firebase/backend here
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // In a real app, you would likely redirect to a login page
    // For this demo, we'll just update the state
    setTimeout(() => {
        // Simulate logging back in for demo purposes
        setUser(mockUser);
        toast({
            title: "Welcome Back!",
            description: "You have been logged back in for this demo.",
        });
    }, 2000);
  };
  
  const updateUser = (newDetails: Partial<User>) => {
    if(user) {
      setUser(prevUser => ({...prevUser!, ...newDetails}));
    }
  }

  return (
    <UserContext.Provider value={{ user, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
