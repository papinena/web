import { useState } from "react";
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
  },
  condominium: {
    name: "",
  },
  condominiumAdministrator: {
    name: "",
  },
  employees: [{ name: "", email: "" }],
} as CreateAdminType;

const STORAGE_KEY = "admin-form-fields";

export function useAdminForm() {
  const [fields, setFields] = useState<typeof defaultValues>(() => {
    if (typeof window === "undefined") return defaultValues;
    const storedValues = localStorage.getItem(STORAGE_KEY);
    if (!storedValues) return defaultValues;

    return JSON.parse(storedValues);
  });

  function setLocalStorageFields(f: typeof fields) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  }

  function _setFields(f: typeof fields) {
    console.log(f);
    setFields(f);
    setLocalStorageFields(f);
  }

  return { fields, setFields: _setFields };
}
