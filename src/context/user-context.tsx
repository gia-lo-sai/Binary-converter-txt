"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useDoc, useMemoFirebase, useUser as useFirebaseAuthUser } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string;
  email: string;
};

type UserContextType = {
  user: UserProfile | null;
  logout: () => void;
  updateUser: (newDetails: Partial<UserProfile>) => void;
  isUserLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth, firestore } = useFirebase();
  const { user: authUser, isUserLoading: isAuthLoading } = useFirebaseAuthUser();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, "users", authUser.uid, "profile");
  }, [firestore, authUser]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const logout = () => {
    if (auth) {
      signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const updateUser = (newDetails: Partial<UserProfile>) => {
    if (userProfileRef && userProfile) {
        const updatedProfile = { ...userProfile, ...newDetails };
        setDocumentNonBlocking(userProfileRef, updatedProfile, { merge: true });
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    }
  };
  
  const user = useMemo(() => {
    if (userProfile && authUser) {
      return {
        ...userProfile,
        email: authUser.email || userProfile.email,
        id: authUser.uid
      };
    }
    return null;
  }, [userProfile, authUser])


  return (
    <UserContext.Provider value={{ user, logout, updateUser, isUserLoading: isAuthLoading || isProfileLoading }}>
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
