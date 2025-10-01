import type {
  EmployeePostAPIProps,
  EmployeePostUIProps,
  UserPostAPIProps,
  UserPostUIProps,
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

export class UserPostMapper {
  static toDomain(data: UserPostAPIProps): UserPostUIProps {
    return {
      ...data,
      categories: data.categories.map((c) => ({ ...c, label: c.name })),
      types: data.types.map((t) => ({ ...t, label: t.name })),
      description: data.description ?? "",
    };
  }
}
