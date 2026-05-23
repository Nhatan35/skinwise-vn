import { routes } from "@/shared/constants/routes";

export const dashboardRoute = routes.DASHBOARD;
export const skinProfileRoute = routes.SKIN_PROFILE;
export const routinesRoute = routes.ROUTINES;
export const journalRoute = routes.JOURNAL;

type DashboardNavHref =
  | typeof dashboardRoute
  | typeof skinProfileRoute
  | typeof routinesRoute
  | typeof journalRoute;

export type DashboardNavItem = {
  disabled: boolean;
  href: DashboardNavHref | null;
  label: string;
  status: "Active" | "Chưa implement";
};

export const dashboardNavItems = [
  {
    disabled: false,
    href: dashboardRoute,
    label: "Dashboard",
    status: "Active",
  },
  {
    disabled: false,
    href: skinProfileRoute,
    label: "Skin Profile",
    status: "Active",
  },
  {
    disabled: false,
    href: routinesRoute,
    label: "Routines",
    status: "Active",
  },
  {
    disabled: true,
    href: null,
    label: "Today Log",
    status: "Chưa implement",
  },
  {
    disabled: false,
    href: journalRoute,
    label: "Journal",
    status: "Active",
  },
  {
    disabled: true,
    href: null,
    label: "Products",
    status: "Chưa implement",
  },
  {
    disabled: true,
    href: null,
    label: "Ingredients",
    status: "Chưa implement",
  },
] satisfies DashboardNavItem[];
