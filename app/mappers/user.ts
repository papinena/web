import type { UserAPIProps, UserUIProps } from "~/interfaces/user";
import type { CreateUserType } from "~/parsers/create-user";

export class UserMapper {
  /**
   * Maps user data from the API (snake_case) to the UI format (camelCase).
   * @param user - The user data from the API.
   * @returns The user data formatted for the UI.
   */
  static toUI(user: UserAPIProps): UserUIProps {
    return {
      id: user.id,
      name: user.name,
      lastName: user.last_name,
      email: user.email,
      birthDate: new Date(user.birth_date),
      telephone: user.telephone,
      block: user.block,
      apartment: user.apartment,
      condominiumId: user.condominiumId,
      permission: user.permission,
      isApproved: user.is_approved,
      active: user.active,
      avatar: user.avatar,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  /**
   * Maps user data from the UI/form (camelCase) to the API format (snake_case).
   * This is useful for sending update/create requests.
   * @param user - The user data from the form.
   * @returns The user data formatted for the API.
   */
  static toAPI(
    user: CreateUserType
  ): Partial<UserAPIProps & { password: string }> {
    return {
      name: user.name,
      last_name: user.lastName,
      birth_date: user.birthDate
        ? new Date(user.birthDate).toISOString()
        : undefined,
      telephone: user.telephone,
      email: user.email,
      block: user.block,
      apartment: user.apartment,
      password: user.password,
      condominiumId: Number(user.condominiumId),
      avatar: user.photo,
      // We don't include fields that are not part of the update form
    };
  }
}
