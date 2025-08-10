export interface UserAPIProps {
  id: string;
  name: string;
  last_name: string;
  email: string;
  birth_date: string;
  telephone: string;
  block: string;
  apartment: string;
  condominiumId: number;
  permission: string;
  is_approved: boolean;
  active: boolean;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface UserUIProps {
  id: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: Date;
  telephone: string;
  block: string;
  apartment: string;
  condominiumId: number;
  permission: string;
  isApproved: boolean;
  active: boolean;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
