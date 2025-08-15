export interface CondominiumAdministratorAPIProps {
  id: number;
  name: string;
  contact: string;
  address: string;
  telephone: string;
  email: string;
  door_keeper_chief: string | null;
  reception_telephone: string | null;
  counsil: string | null;
}

export interface CondominiumAdministratorUIProps {
  id: number;
  name: string;
  contact: string;
  address: string;
  telephone: string;
  email: string;
  doorKeeperChief: string;
  receptionTelephone: string;
  counsil: string;
}
