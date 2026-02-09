import React, { createContext, useContext, useState } from 'react';

type SensoryContextType = {
  customTriggerNames: string[];
  addCustomTrigger: (name: string) => void;
};

const SensoryContext = createContext<SensoryContextType | null>(null);

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [customTriggerNames, setCustomTriggerNames] = useState<string[]>([]);

  const addCustomTrigger = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCustomTriggerNames((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
  };

  return (
    <SensoryContext.Provider value={{ customTriggerNames, addCustomTrigger }}>
      {children}
    </SensoryContext.Provider>
  );
}

export function useSensory() {
  const ctx = useContext(SensoryContext);
  if (!ctx) throw new Error('useSensory must be used within SensoryProvider');
  return ctx;
}
