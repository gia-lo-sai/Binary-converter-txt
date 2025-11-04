"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useDoc, useMemoFirebase, useUser as useFirebaseAuthUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { updateEmail } from "firebase/auth";

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
    return doc(firestore, "users", authUser.uid, "profile", authUser.uid);
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
    if (userProfileRef && userProfile && auth.currentUser) {
        const updatedProfile = { ...userProfile, ...newDetails };
        
        if (newDetails.email && newDetails.email !== auth.currentUser.email) {
            updateEmail(auth.currentUser, newDetails.email).then(() => {
                setDocumentNonBlocking(userProfileRef, updatedProfile, { merge: true });
                toast({
                    title: "Profile Updated",
                    description: "Your changes have been saved successfully.",
                });
            }).catch((error) => {
                let description = "An unknown error occurred while updating your email.";
                if (error.code === 'auth/requires-recent-login') {
                    description = "Please log in again to update your email address.";
                } else if (error.code === 'auth/email-already-in-use') {
                    description = "This email is already in use by another account.";
                }
                toast({
                    variant: "destructive",
                    title: "Email Update Failed",
                    description: description,
                });
            });
        } else {
            setDocumentNonBlocking(userProfileRef, updatedProfile, { merge: true });
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        }
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
    // Create a default profile for anonymous users or new users
    if (authUser && !userProfile) {
      const isAnonymous = authUser.isAnonymous;
      const uid = authUser.uid;
      const defaultUsername = isAnonymous ? `Guest-${uid.substring(0, 5)}` : (authUser.email?.split('@')[0] || `User-${uid.substring(0,5)}`);
      const defaultEmail = isAnonymous ? "anonymous@example.com" : authUser.email || "";

      const defaultProfile: UserProfile = {
        id: uid,
        username: defaultUsername,
        avatarUrl: `https://i.pravatar.cc/150?u=${uid}`,
        email: defaultEmail,
      };

      if (userProfileRef) {
        setDocumentNonBlocking(userProfileRef, defaultProfile, { merge: true });
      }

      return defaultProfile;
    }
    return null;
  }, [userProfile, authUser, userProfileRef]);


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
