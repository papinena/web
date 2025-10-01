export type PostMediaProps = {
  id: string;
  filename: string;
  type: "IMAGE" | "VIDEO";
  postId: string;
  createdAt: string;
  updatedAt: string;
};

export type PostCategoryProps = {
  id: number;
  name: string;
  is_default: boolean;
};

export type PostCategoryUIProps = {
  id: number;
  name: string;
  is_default: boolean;
  label: string;
};

export type PostTypeProps = {
  id: number;
  name: string;
  is_default: boolean;
};

export type PostTypeUIProps = {
  id: number;
  name: string;
  label: string;
  is_default: boolean;
};

export type PostAuthorEmployeeProps = {
  name: string;
  avatar: string | null;
  apartment: string;
  block: string;
  telephone: string;
  condominiumId: number;
  position: string;
};

export type PostAuthorProps = {
  name: string;
  avatar: string | null;
  apartment: string;
  block: string;
  telephone: string;
};

export type EmployeePostUIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  expiresOn: string;
  social: string;
  priority: "LOW" | "NORMAL" | "HIGH";
  authorId: string;
  createdAt: string;
  employee: PostAuthorEmployeeProps;
  updatedAt: string;
  types: PostTypeProps[];
  categories: PostCategoryProps[];
  photos: PostMediaProps[];
};
export type EmployeePostAPIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  expiresOn: string;
  social: string;
  priority: "LOW" | "NORMAL" | "HIGH";
  authorId: string;
  createdAt: string;
  employee: PostAuthorEmployeeProps;
  updatedAt: string;
  types: PostTypeProps[];
  categories: PostCategoryProps[];
  media: PostMediaProps[];
};

export type UserPostAPIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  expiresOn: string;
  social: string;
  priority: string;
  authorId: string;
  createdAt: string;
  author: PostAuthorProps;
  updatedAt: string;
  types: PostTypeProps[];
  categories: PostCategoryProps[];
  media: PostMediaProps[];
  includeTelephone: boolean;
};

export type UserPostUIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  expiresOn: string;
  social: string;
  priority: string;
  authorId: string;
  createdAt: string;
  author: PostAuthorProps;
  updatedAt: string;
  types: PostTypeUIProps[];
  categories: PostCategoryUIProps[];
  media: PostMediaProps[];
  includeTelephone: boolean;
};
