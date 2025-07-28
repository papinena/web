import { useQuery } from "@tanstack/react-query";
import { getUserRegisterData } from "~/services/get-user-register-data";

export function useUserRegisterData() {
  return useQuery({
    queryKey: ["user-register-data"],
    queryFn: getUserRegisterData,
  });
}