import { useState, useCallback } from "react";

export interface GeneralSettings {
  theme: "light" | "dark" | "system";
  language: "en" | "vi" | "fr" | "es";
  messageNotifications: boolean;
  soundEffects: boolean;
}

export interface GeneralSettingsStore {
  current: GeneralSettings;
  fixing: GeneralSettings;
  setCurrent: (settings: Partial<GeneralSettings>) => void;
  setFixing: (settings: Partial<GeneralSettings>) => void;
  loadSettings: () => void;
  saveSettings: () => void;
  resetToDefault: () => void;
}

const defaultSettings: GeneralSettings = {
  theme: "light",
  language: "en",
  messageNotifications: true,
  soundEffects: true,
};

export function useGeneralSettingsStore(): GeneralSettingsStore {
  const [current, setCurrent] = useState<GeneralSettings>(defaultSettings);
  const [fixing, setFixing] = useState<GeneralSettings>(defaultSettings);

  const updateCurrent = (settings: Partial<GeneralSettings>) => {
    setCurrent(prev => ({ ...prev, ...settings }));
  };

  const updateFixing = (settings: Partial<GeneralSettings>) => {
    setFixing(prev => ({ ...prev, ...settings }));
  };

  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem("generalSettings");
      let loadedSettings: GeneralSettings;
      
      if (savedSettings) {
        loadedSettings = JSON.parse(savedSettings) as GeneralSettings;
      } else {
        loadedSettings = defaultSettings;
      }
      
      setCurrent(loadedSettings);
      console.log("current setting general:" ,savedSettings )
      setFixing(loadedSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
      setCurrent(defaultSettings);
      setFixing(defaultSettings);
    }
  }, []);

  const saveSettings = () => {
    try {
      setCurrent(fixing);
      localStorage.setItem("generalSettings", JSON.stringify(fixing));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const resetToDefault = () => {
    setCurrent(defaultSettings);
    setFixing(defaultSettings);
    localStorage.removeItem("generalSettings");
  };

  return {
    current,
    fixing,
    setCurrent: updateCurrent,
    setFixing: updateFixing,
    loadSettings,
    saveSettings,
    resetToDefault,
  };
}