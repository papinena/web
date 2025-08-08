import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/app.tsx", [
    index("./routes/index.tsx"),
    ...prefix("/post", [
      route("/:postId", "./routes/post/index.tsx"),
      route("/create", "./routes/post/new-post.tsx"),
      route("/create/preview", "./routes/post/preview.tsx"),
      route("/update/:postId", "./routes/post/update-post.tsx"),
      route("/update/:postId/preview", "./routes/post/update-post-preview.tsx"),
      route("/my-publications", "./routes/post/my-publications.tsx"),
    ]),
    route("login", "./routes/login.tsx"),
    ...prefix("admin", [
      route("dashboard", "./routes/admin/dashboard.tsx"),
      route("residents", "./routes/admin/residents.tsx"),
    ]),
    ...prefix("register", [
      ...prefix("user", [
        route("/", "./routes/register/user/user.tsx"),
        route("/form", "./routes/register/user/user-form.tsx"),
        route("/submitted", "./routes/register/user/submitted.tsx"),
      ]),
      ...prefix("admin", [
        route("/", "./routes/register/admin/admin.tsx"),
        route("/form", "./routes/register/admin/admin-form.tsx"),
        route("/submitted", "./routes/register/admin/submitted.tsx"),
      ]),
      route("error", "./routes/register/error.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
