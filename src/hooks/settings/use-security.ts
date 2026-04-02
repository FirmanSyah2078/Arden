// src/hooks/settings/use-security.ts
import { useState } from "react";

export function useSecurity() {
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: "new" | "confirm", value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length < 8) return 0; 

    let score = 1; 
    
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[^A-Za-z0-9]/.test(pass);

    const isSequential = /(01234567|12345678|abcdefgh|qwertyui|password|admin123)/i.test(pass);
    if (isSequential) return 1; 

    const typesCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    
    if (typesCount === 2) score = 2; 
    if (typesCount === 3) score = 3; 
    if (typesCount === 4) score = 4; 
    
    if (pass.length >= 12 && typesCount >= 3) score = 4;

    return score;
  };

  const strengthScore = calculateStrength(passwords.new);
  const isDirty = passwords.new.length > 0 || passwords.confirm.length > 0;
  const isMatch = passwords.new === passwords.confirm && passwords.confirm.length > 0;
  const isValidLength = passwords.new.length >= 8;
  
  const isSaveDisabled = !isDirty || !isMatch || !isValidLength || isSubmitting;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPasswords({ new: "", confirm: "" });
      setShowPasswords({ new: false, confirm: false });
    } catch (error: any) {
      alert("Terjadi kesalahan sistem saat memperbarui kata sandi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    passwords,
    showPasswords,
    isSubmitting,
    isDirty,
    isMatch,
    isValidLength,
    strengthScore,
    isSaveDisabled,
    handleChange,
    toggleVisibility,
    handleSave,
  };
}