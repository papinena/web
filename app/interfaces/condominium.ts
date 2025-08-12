export interface Condominium {
  id: number;
  name: string;
}

export type CondominiumAPIProps = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  condominiumAdministratorId: number;
};
