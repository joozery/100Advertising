export type Work = { id: string; title: string; subtitle: string; src: string; images: string[]; order: number; published: boolean };
export type Service = { id: string; title: string; detail: string; src: string; icon: "sign" | "print" | "sticker" | "design"; color: "yellow" | "pink" | "cyan" | "black"; order: number; published: boolean };
export type Content = { works: Work[]; services: Service[] };
export type ContentKind = keyof Content;
export type AdminUser = { id: string; name: string; email: string; passwordHash: string; role: "admin" | "editor"; enabled: boolean; primary: boolean; bootstrapFingerprint?: string };
export type PublicAdminUser = Omit<AdminUser, "passwordHash" | "bootstrapFingerprint">;
