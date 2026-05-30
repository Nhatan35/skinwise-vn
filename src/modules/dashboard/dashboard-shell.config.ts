import { routes } from "@/shared/constants/routes";

export const dashboardRoute = routes.DASHBOARD;
export const skinProfileRoute = routes.SKIN_PROFILE;
export const routinesRoute = routes.ROUTINES;
export const todayLogRoute = routes.TODAY_LOG;
export const journalRoute = routes.JOURNAL;
export const productsRoute = routes.PRODUCTS;
export const savedProductsRoute = routes.SAVED_PRODUCTS;
export const insightsRoute = routes.INSIGHTS;
export const ingredientsRoute = routes.INGREDIENTS;
export const settingsRoute = routes.SETTINGS;

type DashboardNavHref =
  | typeof dashboardRoute
  | typeof skinProfileRoute
  | typeof routinesRoute
  | typeof todayLogRoute
  | typeof journalRoute
  | typeof productsRoute
  | typeof savedProductsRoute
  | typeof insightsRoute
  | typeof ingredientsRoute
  | typeof settingsRoute;

export type DashboardNavItem = {
  disabled: boolean;
  href: DashboardNavHref | null;
  label: string;
  status: "Active" | "Future";
};

export const dashboardNavItems: DashboardNavItem[] = [
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
    disabled: false,
    href: todayLogRoute,
    label: "Today Log",
    status: "Active",
  },
  {
    disabled: false,
    href: journalRoute,
    label: "Journal",
    status: "Active",
  },
  {
    disabled: false,
    href: productsRoute,
    label: "Products",
    status: "Active",
  },
  {
    disabled: false,
    href: savedProductsRoute,
    label: "Saved Products",
    status: "Active",
  },
  {
    disabled: false,
    href: insightsRoute,
    label: "Insights",
    status: "Active",
  },
  {
    disabled: false,
    href: ingredientsRoute,
    label: "Ingredients",
    status: "Active",
  },
  {
    disabled: false,
    href: settingsRoute,
    label: "Settings",
    status: "Active",
  },
];
