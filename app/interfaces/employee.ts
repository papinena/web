export interface EmployeeAPIProps {
  id: string;
  name: string;
  last_name: string;
  telephone: string;
  position: string;
  is_resident: boolean;
  block: string | null;
  apartment: string | null;
  email: string;
  is_register_completed: boolean;
  active: boolean;
  avatar: string | null;
  condominiumId: number;
  created_at: string;
  updated_at: string;
  permission: string;
}

export interface EmployeeUIProps {
  id: string;
  name: string;
  lastName: string;
  telephone: string;
  position: string;
  isResident: boolean;
  block: string | null;
  apartment: string | null;
  email: string;
  isRegisterCompleted: boolean;
  active: boolean;
  avatar: string | null;
  condominiumId: number;
  createdAt: string;
  updatedAt: string;
  permission: string;
}
