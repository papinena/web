import type {
  EmployeePostAPIProps,
  EmployeePostUIProps,
} from "~/interfaces/post";

export class AdminPostMapper {
  static toDomain(data: EmployeePostAPIProps): EmployeePostUIProps {
    return {
      ...data,
      photos: data.media,
      description: data.description ?? "",
    };
  }
}
