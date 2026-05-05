import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CommunicationSettingsData } from "@/types/api";

const DEFAULT_WARNING_MESSAGE = "The menstrual period has exceeded the maximum limit. Please report if you have purified.";

export function useCommunications() {
  const [settings, setSettings] = useState<CommunicationSettingsData>({
    isNotificationActive: true,
    warningMessage: DEFAULT_WARNING_MESSAGE,
  });

  const [savedSettings, setSavedSettings] = useState<CommunicationSettingsData>({
    isNotificationActive: true,
    warningMessage: DEFAULT_WARNING_MESSAGE,
  });

  const [isLoading, setIsLoading] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof CommunicationSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); 
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

  return { settings, isLoading, isSaving, isDraftModified, handleChange, handleSave, defaultMessage: DEFAULT_WARNING_MESSAGE };
}