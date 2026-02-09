import React, { createContext, useContext, useState } from 'react';

export type CommunicationMethod = 'verbal' | 'semi-verbal' | 'nonverbal';

export type SensitivityLevel = 0 | 1 | 2; // Low, Med, High

export type ProfileSensory = {
  noiseLevel?: SensitivityLevel;
  lightingLevel?: SensitivityLevel;
  triggerNames?: string[];
};

export type ProfileFood = {
  safeFoods?: string[];
  aversions?: string[];
  dietary?: string[];
};

export type ProfileRoutine = {
  routineLevel?: SensitivityLevel;
  waitTime?: string | null;
  seating?: string[];
};

export type ChildProfile = {
  id: string;
  name: string;
  age: string;
  communicationMethod?: CommunicationMethod;
  primaryLanguage?: string;
  secondaryLanguage?: string;
  communicationNotes?: string;
  sensory?: ProfileSensory;
  food?: ProfileFood;
  routine?: ProfileRoutine;
};

type ProfilesContextType = {
  profiles: ChildProfile[];
  currentProfileId: string | null;
  setCurrentProfileId: (id: string | null) => void;
  addProfile: (name: string, age: string) => string;
  updateProfile: (id: string, name: string, age: string) => void;
  updateProfileCommunication: (
    id: string,
    data: Pick<
      ChildProfile,
      | 'communicationMethod'
      | 'primaryLanguage'
      | 'secondaryLanguage'
      | 'communicationNotes'
    >
  ) => void;
  updateProfileSensory: (id: string, data: ProfileSensory) => void;
  updateProfileFood: (id: string, data: ProfileFood) => void;
  updateProfileRoutine: (id: string, data: ProfileRoutine) => void;
};

const ProfilesContext = createContext<ProfilesContextType | null>(null);

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const addProfile = (name: string, age: string) => {
    const id = Date.now().toString();
    setProfiles((prev) => [...prev, { id, name, age }]);
    return id;
  };

  const updateProfile = (id: string, name: string, age: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, age } : p))
    );
  };

  const updateProfileCommunication = (
    id: string,
    data: Pick<
      ChildProfile,
      | 'communicationMethod'
      | 'primaryLanguage'
      | 'secondaryLanguage'
      | 'communicationNotes'
    >
  ) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const updateProfileSensory = (id: string, data: ProfileSensory) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, sensory: data } : p))
    );
  };

  const updateProfileFood = (id: string, data: ProfileFood) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, food: data } : p))
    );
  };

  const updateProfileRoutine = (id: string, data: ProfileRoutine) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, routine: data } : p))
    );
  };

  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        currentProfileId,
        setCurrentProfileId,
        addProfile,
        updateProfile,
        updateProfileCommunication,
        updateProfileSensory,
        updateProfileFood,
        updateProfileRoutine,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfilesProvider');
  return ctx;
}
