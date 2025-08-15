import type { EmployeeAPIProps, EmployeeUIProps } from "~/interfaces/employee";

export class EmployeeMapper {
  /**
   * Maps employee data from the API (snake_case) to the UI format (camelCase).
   * @param employee - The employee data from the API.
   * @returns The employee data formatted for the UI.
   */
  static toUI(employee: EmployeeAPIProps): EmployeeUIProps {
    return {
      id: employee.id,
      name: employee.name,
      lastName: employee.last_name,
      telephone: employee.telephone,
      position: employee.position,
      isResident: employee.is_resident,
      block: employee.block,
      apartment: employee.apartment,
      email: employee.email,
      isRegisterCompleted: employee.is_register_completed,
      active: employee.active,
      avatar: employee.avatar,
      condominiumId: employee.condominiumId,
      createdAt: employee.created_at,
      updatedAt: employee.updated_at,
      permission: employee.permission,
    };
  }

  /**
   * Maps employee data from the UI/form (camelCase) to the API format (snake_case).
   * This is useful for sending update/create requests.
   * @param employee - The employee data from the form.
   * @returns The employee data formatted for the API.
   */
  static toAPI(
    employee: Partial<EmployeeUIProps>
  ): Partial<EmployeeAPIProps> {
    return {
      name: employee.name,
      last_name: employee.lastName,
      telephone: employee.telephone,
      position: employee.position,
      is_resident: employee.isResident,
      block: employee.block,
      apartment: employee.apartment,
      email: employee.email,
    };
  }
}
