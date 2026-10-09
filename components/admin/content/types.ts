import type { Work, Service } from "@/lib/types";
export type Draft = Work & Pick<Service, "detail" | "icon" | "color">;
