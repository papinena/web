import {
  type RouteConfig,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/app.tsx", [
    route("login", "./routes/login.tsx"),
    ...prefix("admin", [
      route("dashboard", "./routes/admin/dashboard.tsx"),
      route("residents", "./routes/admin/residents.tsx"),
    ]),
    ...prefix("register", [
      route("user", "./routes/register/user.tsx"),
      route("user/form", "./routes/register/user-form.tsx"),
      route("admin", "./routes/register/admin.tsx"),
      route("admin/form", "./routes/register/admin-form.tsx"),
      route("admin/submitted", "./routes/register/submitted.tsx"),
      route("error", "./routes/register/error.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
