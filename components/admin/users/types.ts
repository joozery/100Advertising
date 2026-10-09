import type { PublicAdminUser } from "@/lib/types";
export type UserDraft = Omit<PublicAdminUser, "id" | "primary"> & {
    id?: string;
    password: string;
};
