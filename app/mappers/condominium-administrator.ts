import {
  type CondominiumAdministratorAPIProps,
  type CondominiumAdministratorUIProps,
} from "~/interfaces/condominium-administrator";

export class CondominiumAdministratorMapper {
  static toUI(
    data: CondominiumAdministratorAPIProps
  ): CondominiumAdministratorUIProps {
    return {
      id: data.id,
      name: data.name,
      contact: data.contact,
      address: data.address,
      telephone: data.telephone,
      email: data.email,
      doorKeeperChief: data.door_keeper_chief ?? "",
      receptionTelephone: data.reception_telephone ?? "",
      counsil: data.counsil ?? "",
    };
  }

  static toAPI(
    data: Partial<CondominiumAdministratorUIProps>
  ): Partial<CondominiumAdministratorAPIProps> {
    return {
      name: data.name,
      contact: data.contact,
      address: data.address,
      telephone: data.telephone,
      email: data.email,
      door_keeper_chief: data.doorKeeperChief,
      reception_telephone: data.receptionTelephone,
      counsil: data.counsil,
    };
  }
}
