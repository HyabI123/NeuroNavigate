import React, { createContext, useContext, useState } from 'react';

export type ChildProfile = {
  id: string;
  name: string;
  age: string;
};

type ProfilesContextType = {
  profiles: ChildProfile[];
  addProfile: (name: string, age: string) => void;
  updateProfile: (id: string, name: string, age: string) => void;
};

const ProfilesContext = createContext<ProfilesContextType | null>(null);

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);

  const addProfile = (name: string, age: string) => {
    setProfiles((prev) => [
      ...prev,
      { id: Date.now().toString(), name, age },
    ]);
  };

  const updateProfile = (id: string, name: string, age: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, age } : p))
    );
  };

  return (
    <ProfilesContext.Provider value={{ profiles, addProfile, updateProfile }}>
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfilesProvider');
  return ctx;
}
