export type BasicInformationFormData = {
  telephone: string;
  birthDate?: string;
  position: string;
  isResident: boolean;
  block: string;
  apartment: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
};

export type CondominiumInformationFormData = {
  condominiumName: string;
  condominiumAdministratorName: string;
  condominiumAdministratorCounsil?: string;
  condominiumAdministratorContact?: string;
  condominiumAdministratorAddress?: string;
  condominiumAdministratorTelephone?: string;
  condominiumAdministratorEmail?: string;
  doorKeeperChief?: string;
  receptionTelephone?: string;
  condominiumUsefulInformation?: string;
};

export type EmployeesInformationFormData = {
  employees: {
    name: string;
    email: string;
  }[];
};
