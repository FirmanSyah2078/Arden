// src/hooks/communications/use-communications.ts
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const DEFAULT_WARNING_MESSAGE = "The menstrual period has exceeded the maximum limit. Please report if you have purified.";

export interface CommunicationSettings {
  isNotificationActive: boolean;
  warningMessage: string;
}

export function useCommunications() {
  const [settings, setSettings] = useState<CommunicationSettings>({
    isNotificationActive: true,
    warningMessage: DEFAULT_WARNING_MESSAGE,
  });

  const [savedSettings, setSavedSettings] = useState<CommunicationSettings>({
    isNotificationActive: true,
    warningMessage: DEFAULT_WARNING_MESSAGE,
  });

  const [isLoading, setIsLoading] = useState(false); // Nanti diubah jadi true kalau narik API
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof CommunicationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // TODO: Fetch ke API untuk save data (Belum dibuat DB-nya)
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi Delay
      setSavedSettings(settings);
      toast.success("Warning format updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update format.`);
    } finally {
      setIsSaving(false);
    }
  };

  const isDraftModified = useMemo(() => {
    return (
      settings.isNotificationActive !== savedSettings.isNotificationActive ||
      settings.warningMessage !== savedSettings.warningMessage
    );
  }, [settings, savedSettings]);

  return { settings, isLoading, isSaving, isDraftModified, handleChange, handleSave };
}