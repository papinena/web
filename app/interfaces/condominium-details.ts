import type { UserAPIProps } from "./user";

export interface CondominiumAdministrator {
  id: number;
  name: string;
  contact: string;
  address: string;
  telephone: string;
  email: string;
  door_keeper_chief: string | null;
  reception_telephone: string | null;
  counsil: string;
}

export interface CondominiumEmployee extends UserAPIProps {
  position: string;
  is_resident: boolean;
  permission: "BASIC" | "ADMIN";
}
