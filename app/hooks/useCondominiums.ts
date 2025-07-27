import { useQuery } from "@tanstack/react-query";
import { getUserRegister } from "~/services/get-condominiums";

export function useUserRegister() {
  return useQuery({
    queryKey: ["user-register"],
    queryFn: getUserRegister,
  });
}
