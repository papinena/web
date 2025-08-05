import { redirect } from "react-router";
import { authUtils } from "~/utils/auth";

export const clientLoader = async () => {
  const authData = authUtils.getAuthData();

  if (authData?.userType === "user") {
    // todo
  }

  if (authData?.userType === "employee") {
    return redirect("/admin/dashboard");
  }

  return null;
};

export default function Index() {
  return null;
}
