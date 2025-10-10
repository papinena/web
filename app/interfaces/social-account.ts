export type SocialAccountAPIProps = {
  id: string;
  provider: "apple" | "google";
  providerId: string;
  userId: string | null;
  employeeId: string | null;
};
