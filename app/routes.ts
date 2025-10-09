import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route(
    "apple-app-site-association",
    "./routes/apple-app-site-association.tsx"
  ),
  ...prefix("password", [
    route("forgot", "./routes/password/forgot.tsx"),
    route("reset", "./routes/password/reset.tsx"),
  ]),
  route("/contact", "./routes/contact.tsx"),
  route("/privacy-policy", "./routes/privacy-policy.tsx"),
  layout("./routes/app.tsx", [
    route("/search", "./routes/search.tsx"),
    index("./routes/index.tsx"),
    route("/faq", "./routes/faq.tsx"),
    ...prefix("/post", [
      route("/:postId", "./routes/post/index.tsx"),
      route("/create", "./routes/post/new-post.tsx"),
      route("/create/preview", "./routes/post/preview.tsx"),
      route("/update/:postId", "./routes/post/update-post.tsx"),
      route("/update/:postId/preview", "./routes/post/update-post-preview.tsx"),
      route("/my-publications", "./routes/post/my-publications.tsx"),
      ...prefix("admin", [
        route(":postId", "./routes/post/admin/index.tsx"),
        route("create", "./routes/post/admin/new-post.tsx"),
        route("update/:postId", "./routes/post/admin/update-post.tsx"),
        route("preview", "./routes/post/admin/preview.tsx"),
        route("preview/:postId", "./routes/post/admin/update-post-preview.tsx"),
      ]),
    ]),
    ...prefix("/posts", [
      route("/condominium", "./routes/post/condominium.tsx"),
      ...prefix("/admin", [index("./routes/post/admin/my-publications.tsx")]),
    ]),
    ...prefix("user", [
      route("login", "./routes/user/login.tsx"),
      route("dashboard", "./routes/user/dashboard.tsx"),
      route("edit", "./routes/user/edit.tsx"),
      route("condominium", "./routes/user/condominium.tsx"),
    ]),
    ...prefix("admin", [
      route("login", "./routes/admin/login.tsx"),
      route("dashboard", "./routes/admin/dashboard.tsx"),
      ...prefix("employees", [
        index("./routes/admin/employees/index.tsx"),
        route("/manage", "./routes/admin/employees/manage-employees.tsx"),
        route("/add", "./routes/admin/employees/new-employees.tsx"),
      ]),
      route("edit", "./routes/admin/edit.tsx"),
      route("residents", "./routes/admin/residents.tsx"),
    ]),
    ...prefix("register", [
      layout("./routes/register/layout.tsx", [
        ...prefix("user", [
          route("/", "./routes/register/user/user.tsx"),
          route("/form", "./routes/register/user/user-form.tsx"),
          route(
            "/social/form",
            "./routes/register/user/user-google-social-form.tsx"
          ),
          route("/submitted", "./routes/register/user/submitted.tsx"),
        ]),
        ...prefix("admin", [
          route("/", "./routes/register/admin/admin.tsx"),
          route("/form", "./routes/register/admin/admin-form.tsx"),
          route("/fulfill", "./routes/register/admin/fulfill-form.tsx"),
          route("/social/form", "./routes/register/admin/social-form.tsx"),
          route("/submitted", "./routes/register/admin/submitted.tsx"),
        ]),
        route("error", "./routes/register/error.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
