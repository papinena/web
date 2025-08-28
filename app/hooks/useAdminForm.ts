import { useState, type ChangeEvent } from "react";
import { type CreateAdminType } from "~/parsers/create-admin";

const defaultValues = {
  employee: {
    name: "",
    lastName: "",
    telephone: "",
    position: "",
    isResident: undefined,
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    photo: "",
  },
  condominium: {
    name: "",
  },
  condominiumAdministrator: {
    name: "",
  },
  employees: undefined,
} as CreateAdminType;

const STORAGE_KEY = "admin-form-fields";

export function useAdminForm() {
  const [fields, setFields] = useState<typeof defaultValues>(() => {
    if (typeof window === "undefined") return defaultValues;
    const storedValues = localStorage.getItem(STORAGE_KEY);
    if (!storedValues) return defaultValues;

    return JSON.parse(storedValues);
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  function setLocalStorageFields(f: typeof fields) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  }

  function _setFields(f: typeof fields) {
    setFields(f);
    setLocalStorageFields(f);
  }

  function resetLocalStorageFields() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    fields,
    setFields: _setFields,
    preview,
    file,
    handleFileChange,
    resetLocalStorageFields,
  };
}
