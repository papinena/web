import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  route("register", "./routes/layout.tsx", [
    layout("./routes/register/layout.tsx", [
      route("user", "./routes/register/user.tsx"),
      route("user/form", "./routes/register/user-form.tsx"),
      route("admin", "./routes/register/admin.tsx"),
      route("admin/form", "./routes/register/admin-form.tsx"),
      route("admin/submitted", "./routes/register/submitted.tsx"),
      route("error", "./routes/register/error.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
