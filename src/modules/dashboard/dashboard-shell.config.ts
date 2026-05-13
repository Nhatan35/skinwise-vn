export const dashboardRoute = "/dashboard" as const;

export type DashboardNavItem = {
  disabled: boolean;
  href: typeof dashboardRoute | null;
  label: string;
  status: "Active" | "Chưa implement";
};

export type DashboardPlaceholderCard = {
  connectionText: "Sẽ được kết nối ở task/module sau";
  label: string;
  scopeText: "Chưa implement trong Task 6";
};

export const dashboardNavItems = [
  {
    disabled: false,
    href: dashboardRoute,
    label: "Dashboard",
    status: "Active",
  },
  {
    disabled: true,
    href: null,
    label: "Skin Profile",
    status: "Chưa implement",
  },
  {
    disabled: true,
    href: null,
    label: "Routines",
    status: "Chưa implement",
  },
  {
    disabled: true,
    href: null,
    label: "Today Log",
    status: "Chưa implement",
  },
  {
    disabled: true,
    href: null,
    label: "Journal",
    status: "Chưa implement",
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

export const dashboardPlaceholderCards = [
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Skin Profile",
    scopeText: "Chưa implement trong Task 6",
  },
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Routines",
    scopeText: "Chưa implement trong Task 6",
  },
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Today Log",
    scopeText: "Chưa implement trong Task 6",
  },
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Journal",
    scopeText: "Chưa implement trong Task 6",
  },
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Products",
    scopeText: "Chưa implement trong Task 6",
  },
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Ingredients",
    scopeText: "Chưa implement trong Task 6",
  },
  {
    connectionText: "Sẽ được kết nối ở task/module sau",
    label: "Safety Analysis",
    scopeText: "Chưa implement trong Task 6",
  },
] satisfies DashboardPlaceholderCard[];
